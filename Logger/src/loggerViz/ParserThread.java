package loggerViz;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class ParserThread implements Runnable {
	private String logPath;
	private String packageName;
	private String outputPath;

	private HashMap<String, List<HashMap<String, String>>> resultsByDay = new HashMap<String, List<HashMap<String, String>>>();

	private HashSet<String> filesWritten = new HashSet<String>();
	private boolean printParams;
	
	public ParserThread(String logPath, String packageName, String outputPath, HashSet<String> excludedmethods, boolean printParams) {
		this.printParams = printParams;
		this.logPath = logPath;
		this.packageName = packageName;
		this.outputPath = outputPath;
		this.filesWritten = new HashSet<String>();
	}

	private static void log(String message) {
		System.out.println("[INFO]" + message);
	}

	private static void error(String message) {
		System.out.println("[ERROR]" + message);
	}

	/**
	 * Filter all the file names that are not like: server.log.2013-02-25 For
	 * example it discards: ispyb.log.2013-01-31-09 ispyb.log
	 * **/
	private static List<File> filterByFileNames(File[] files) {
		List<File> results = new ArrayList<File>();
		for (File file : files) {
			if (file.getName().contains(".log")){
				results.add(file);
			}
		}
		return results;
	}

	private void writeResult(String outputFilePath, List<String> sortedList) {
		File file = new File(outputFilePath);
		log(String.format("Writing output to: %s", outputFilePath));
		try {
			FileWriter writer = new FileWriter(file, false);
			writer.append(new Gson().toJson(sortedList));
			writer.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
	}

	private void writeResult(String outputFilePath, ArrayList<HashMap<String, String>> result) throws FileNotFoundException {
		File file = new File(outputFilePath);
		log(String.format("Writing output to: %s", outputFilePath));
		System.out.println(result.size());
		
		try {
			/** If it is first time to process the file we remove **/
			if (this.filesWritten.contains(outputFilePath)){
				BufferedReader br = new BufferedReader(new FileReader(outputFilePath));  
				Type typeOfObjectsList = new TypeToken<ArrayList<HashMap<String, String>>>() {}.getType();
				ArrayList<HashMap<String, String>> json = new Gson().fromJson(br, typeOfObjectsList);
				
				for (int i = 0; i < json.size(); i++) {
					result.add(json.get(i));
				}
			}
			else{
				this.filesWritten.add(outputFilePath);
			}
			/** Writting **/
			FileWriter writer = new FileWriter(file, false);
			writer.append(new Gson().toJson(result));
			writer.close();
			
			
		} catch (IOException e) {
			System.out.println(result.size());
			e.printStackTrace();
		}

	}

	public void getResutsByDay(String day, List<HashMap<String, String>> data) throws IOException {
		if (data.size() > 0) {
			if (resultsByDay.get(day) == null) {
				resultsByDay.put(day, new ArrayList<HashMap<String, String>>());
			}
			resultsByDay.get(day).addAll(data);
		}
	}

	public String getDateByFileName(String filename) throws IOException {
		String result = "server.log";
		if (filename.contains("ispyb.log.")){
			List<String> splitted = Arrays.asList(filename.split("\\."));
			if (splitted.size() == 3){
				String date = splitted.get(2);
				List<String> dateSplitted =  Arrays.asList(date.split("-"));
				if (dateSplitted.size() == 4){
					String year = dateSplitted.get(0);
					String month = dateSplitted.get(1);
					String day = dateSplitted.get(2);
					return  year + "_" + month + "_" + day ;
				}
			}
		}
		return result;
		
	}
	
	public void process(String packageName, String outputPath, boolean printParams) throws IOException {
		resultsByDay = new HashMap<String, List<HashMap<String, String>>>();
		log("STARTING " + packageName);
		if (new File(this.logPath).exists()) {
			if (!packageName.toUpperCase().equals("INDEX")){
				log(String.format("Reading files from : %s", this.logPath));
				File[] allFiles = new File(logPath).listFiles();
				List<File> files = filterByFileNames(allFiles);
				
				List<HashMap<String, String>> data  = new ArrayList<HashMap<String,String>>();
				for (File file : files) {
					data.addAll(parseFile(file, packageName, printParams));
				}
				System.out.println(data.size());
//				writeResult(outputPath, new Gson().toJson(data));
			}
			else{
				File[] allFiles = new File(logPath).listFiles();
				HashSet<String> toPrint = new HashSet<String>();
				for (File file : allFiles) {
					if (file.isFile()){
						String name = file.getName();
						String result = this.getDateByFileName(name);
						if (result != null){
							toPrint.add(result);
						}
					}
				}
				List<String> sortedList = new ArrayList<String>(toPrint);
				Collections.sort(sortedList);
				writeResult(outputPath + "/" + packageName + ".json", sortedList);
			}
		} else {
			error("File " + logPath + " doesn't exist");
		}
	}


	
	/**
	 * @param file
	 * @param packageMethodName
	 * @return
	 * @throws IOException
	 */
	private ArrayList<HashMap<String, String>> parseFile(File file, String packageMethodName, boolean printParams) throws IOException {
		ArrayList<HashMap<String, String>> data = new ArrayList<HashMap<String, String>>();
		BufferedReader br = new BufferedReader(new FileReader(file));
		try {
			StringBuilder sb = new StringBuilder();
			String line = br.readLine();

			while (line != null) {
				sb.append(line);
				sb.append("\n");
				line = br.readLine();
				if (line != null){
					if (line.contains(packageMethodName)) {
						if (line.contains("v2.0")) {
							String json = (line.substring(line.indexOf("]") + 1));
							Type HashType = new TypeToken<HashMap<String, String>>() {}.getType();
							try {
								HashMap<String, String> obj = new Gson().fromJson(json, HashType);
								if (!printParams){
									obj.put("PARAMS", "[]");
								}
								data.add(obj);
							} catch (Exception e) {
								e.printStackTrace();
							}
						}
					}
				}
			}
		} finally {
			br.close();
		}
		/**
		 * Writing all data to disk
		 */
		if (!printParams){
			writeResult(outputPath + "/" + packageMethodName + "_" + this.getDateByFileName(file.getName()) + ".json", data);
		}
		else{
			writeResult(outputPath + "/" + packageMethodName + "_" + file.getName() + ".json", data);
		}
		return data;
	}



	@Override
	public void run() {
		try {
			this.process(this.packageName, this.outputPath, this.printParams);
		} catch (IOException e) {
			e.printStackTrace();
		}

	}
}
