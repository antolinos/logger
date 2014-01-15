package loggerViz;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;

import com.google.gson.Gson;

public class ParserThread implements Runnable {
	private String logPath;
	private String packageName;
	private String outputPath;
	private HashSet<String> excludedmethods;
	private HashMap<String, Integer> excludedmethodsInformation;
	
	private HashMap<String, List<HashMap<String, String>>> resultsByDay = new HashMap<String, List<HashMap<String, String>>>();
	
	public ParserThread(String logPath, String packageName, String outputPath, HashSet<String> excludedmethods){
		this.logPath = logPath;
		this.packageName = packageName;
		this.outputPath = outputPath;
		this.excludedmethods = excludedmethods;
		this.excludedmethodsInformation = new HashMap<String, Integer>();
	}
	
	
	private static void log(String message){
		System.out.println("[INFO]" + message);
	}
	
	
	private static void error(String message){
		System.out.println("[ERROR]" + message);
	}
	
	/** Filter all the file names that are not like:
	 * 							server.log.2013-02-25 
	 * For example it discards: ispyb.log.2013-01-31-09 
	 * 							ispyb.log
	 * **/
	private static List<File> filterByFileNames(File[] files){
		List<File> results = new ArrayList<File>();
		for (File file : files) {
			String[] splitted = file.getName().split("\\.");
			if (splitted.length == 3){
				/** it should have this format: 2013-02-25 **/
				String date = Arrays.asList(splitted).get(2);
				if (date.split("-").length == 4) {
					results.add(file);
				}
			}
			else{
				log("Discarding: " + file.getAbsolutePath() );
			}
		}
		return results;
	}
	
	private static String getTitle(File file){
		return "'" + file.getName() + "'";
	}
	
	//outputPath
	private static void writeResult(String outputFilePath, String result, String packageName) throws FileNotFoundException{
		File file = new File(outputFilePath);
		log(String.format("Writing output to: %s", outputFilePath));
		PrintWriter writer = new PrintWriter(file);
		writer = new PrintWriter(file);
		writer.print("function " + packageName +"(){\n return " + result + ";\n }");
		writer.close();
		
	}
	
	
	public void getResutsByDay(String day, List<HashMap<String, String>> data) throws IOException {
		if (data.size() > 0){
			if (resultsByDay.get(day) == null){
				resultsByDay.put(day, new ArrayList<HashMap<String,String>>());
			}
			resultsByDay.get(day).addAll(data);
		}
	}
	
	public void process(String packageName, String outputPath) throws IOException {
		resultsByDay = new HashMap<String, List<HashMap<String,String>>>();
		log("STARTING " + packageName);
		if (new File(this.logPath).exists()){
			log(String.format("Reading files from : %s", this.logPath));
			File[] allFiles = new File(logPath).listFiles();
			List<File> files = filterByFileNames(allFiles);
			for (File file : files) {
				List<HashMap<String, String>> data = parseFile(file, packageName);
				
				String[] splitted = getTitle(file).split("\\.");
				String date = Arrays.asList(splitted).get(2);
				String day = Arrays.asList(date.split("-")).get(2);
				String month = Arrays.asList(date.split("-")).get(1);
				String year = Arrays.asList(date.split("-")).get(0);
				
				String title = (String.format("%s%s%s",   year, month, day));
				getResutsByDay(title, data);
			}
			
			writeResult(outputPath, new Gson().toJson(resultsByDay), packageName);
		}
		else{
			error("File " + logPath + " doesn't exist");
		}
	}
	
	/**
	 * @param file
	 * @param packageMethodName
	 * @return
	 * @throws IOException
	 */
	private ArrayList<HashMap<String, String>> parseFile(File file,String packageMethodName) throws IOException {
		String[] splitted = file.getName().split("\\.");
		String date = Arrays.asList(splitted).get(2);
		String day = Arrays.asList(date.split("-")).get(2);
		String month = Arrays.asList(date.split("-")).get(1);
		String year = Arrays.asList(date.split("-")).get(0);
		
		ArrayList<HashMap<String, String>> data = new ArrayList<HashMap<String, String>>();
		if (year.equals("2014")){
			log(String.format("Parsing file %s \t date(%s:%s:%s)  Package: %s ", date, day, month, year, packageMethodName, file.getTotalSpace()));
			BufferedReader br = new BufferedReader(new FileReader(file));
			try {
				StringBuilder sb = new StringBuilder();
				String line = br.readLine();
				
				String user = null;
				while (line != null) {
					sb.append(line);
					sb.append("\n");
					line = br.readLine();
					
					if (line != null){
						if (packageMethodName.equals("LOGIN")){
							try{
								String time = line.split(" ")[0];
									if (line.contains( ".WelcomeUserAction] proposal is :" )){
										user = line.split("proposal is :")[1];
										
									}
									if (user != null){
										if (line.contains("e.WelcomeUserAction] proposalType =")){
											System.out.println(line + "..." + user);
											String proposalType = line.split("e.WelcomeUserAction] proposalType =")[1];
											data.add(getLogonRow("logon", time, "3000", user, proposalType));
											user = null;
										}
									}
									if (line.contains("Logoff by")){
										user = line.split("Logoff by")[1];
										data.add(getLogonRow("Logoff", time, "3000", user));
										user = null;
									}
								}
								catch(Exception ex){
									System.out.println("No parseable line:   " + line);
								}
						}
//						else{
							if (line.contains( packageMethodName )){
	/** 11:59:36,209 INFO  [ispyb.server.data.ejb3.services.saxs.ToolsForAssemblyWebService] [BIOSAXS_WS, storeDataAnalysisResultByMeasurementId, START, 1364896776209, -1, , ]
	    11:59:36,284 INFO  [ispyb.server.data.ejb3.services.saxs.ToolsForAssemblyWebService] [BIOSAXS_WS, storeDataAnalysisResultByMeasurementId, END, 1364896776209, 75, ,**/
	
								String content = line.substring(line.lastIndexOf(packageMethodName), line.length() - 1);
								List<String> commaSeparated = Arrays.asList(content.split(","));
	//							String packageName = commaSeparated.get(0).trim();
								String methodName = commaSeparated.get(1).trim().toUpperCase();
								/** Start - End **/
								String type = commaSeparated.get(2).trim();
								String time = commaSeparated.get(3).trim();
								String duration = commaSeparated.get(4).trim();
								
								if (type.trim().equals("END")||(type.trim().equals("ERROR"))){
									if (!this.excludedmethods.contains(methodName)){
										if (type.trim().equals("ERROR")){
											String cause = "Unkwon";
											if (Arrays.asList(Arrays.asList(content.split("\\[")).get(0).split(",")).size() > 4 ){
												cause = (Arrays.asList(Arrays.asList(content.split("\\[")).get(0).split(",")).get(5));
											}
											String error = "Unkwon"; 
											if (Arrays.asList(content.split("\\[")).size() > 1){
												error = Arrays.asList(content.split("\\[")).get(1).trim();
											}
											data.add(getRow(methodName, time, duration, error, cause));
										}
										else{
											data.add(getRow(methodName, time, duration));
										}
									}
									else{
										if (!this.excludedmethodsInformation.containsKey(methodName)){
											this.excludedmethodsInformation.put(methodName, 0);
										}
										this.excludedmethodsInformation.put(methodName,this.excludedmethodsInformation.get(methodName) + 1);
									}
								}
//							}
						}
					}
				}
			} finally {
				br.close();
			}
		}
		return data;
	}
	

	private HashMap<String, String> getLogonRow(String methodName, String time, String duration, String user, String proposalType) {
		HashMap<String, String> keys = new HashMap<String, String>();
		keys.put("time", time);
		keys.put("method", methodName);
		keys.put("duration", duration);
		HashMap<String, String> s = new HashMap<String, String>();
		s.put("user", user);
		s.put("proposalType", proposalType);
		keys.put("user", new Gson().toJson(s));
		return keys;
	}


	private static HashMap<String, String> getRow(String methodName, String time, String duration) {
		SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss,SSS",Locale.FRANCE);
		HashMap<String, String> keys = new HashMap<String, String>();
		keys.put("time", sdf.format(new Date(Long.parseLong(time))));
		keys.put("method", methodName);
		keys.put("duration", duration);
		return keys;
	}

	private static HashMap<String, String> getLogonRow(String methodName, String time, String duration, String user) {
		HashMap<String, String> keys = new HashMap<String, String>();
		keys.put("time", time);
		keys.put("method", methodName);
		keys.put("duration", duration);
		HashMap<String, String> s = new HashMap<String, String>();
		s.put("user", user);
		keys.put("user", new Gson().toJson(s));
		
		return keys;
	}

	
	private static HashMap<String, String> getRow(String methodName, String time, String duration, String message, String cause) {
		SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss,SSS",Locale.FRANCE);
		HashMap<String, String> keys = new HashMap<String, String>();
		keys.put("time", sdf.format(new Date(Long.parseLong(time))));
		keys.put("method", methodName);
		keys.put("duration", duration);
		keys.put("message", message);
		keys.put("cause", cause);
		
		return keys;
	}

	@Override
	public void run() {
		try {
			this.process(this.packageName, this.outputPath);
		} catch (IOException e) {
			e.printStackTrace();
		}
		
	}
}
