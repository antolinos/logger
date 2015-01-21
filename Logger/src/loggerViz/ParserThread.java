package loggerViz;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Type;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class ParserThread implements Runnable {
	private String logPath;
	private String packageName;
	private String outputPath;
	private HashSet<String> excludedmethods;
	private HashMap<String, Integer> excludedmethodsInformation;

	private HashMap<String, List<HashMap<String, String>>> resultsByDay = new HashMap<String, List<HashMap<String, String>>>();

	public ParserThread(String logPath, String packageName, String outputPath, HashSet<String> excludedmethods) {
		this.logPath = logPath;
		this.packageName = packageName;
		this.outputPath = outputPath;
		this.excludedmethods = excludedmethods;
		this.excludedmethodsInformation = new HashMap<String, Integer>();
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
			// String[] splitted = file.getName().split("\\.");
			// if (splitted.length == 3){
			// /** it should have this format: 2013-02-25 **/
			// String date = Arrays.asList(splitted).get(2);
			// if (date.split("-").length == 4) {
			results.add(file);
			}
			// }
			// }
			// else{
			// log("Discarding: " + file.getAbsolutePath() );
			// }
		}
		return results;
	}

	private static String getTitle(File file) {
		return "'" + file.getName() + "'";
	}

	// outputPath
	private static void writeResult(String outputFilePath, String result, String packageName) throws FileNotFoundException {
		File file = new File(outputFilePath);
		log(String.format("Writing output to: %s", outputFilePath));
		PrintWriter writer = new PrintWriter(file);
		writer = new PrintWriter(file);
		writer.print("function " + packageName + "(){\n return " + result + ";\n }");
		writer.close();

	}

	public void getResutsByDay(String day, List<HashMap<String, String>> data) throws IOException {
		if (data.size() > 0) {
			if (resultsByDay.get(day) == null) {
				resultsByDay.put(day, new ArrayList<HashMap<String, String>>());
			}
			resultsByDay.get(day).addAll(data);
		}
	}

	public void process(String packageName, String outputPath) throws IOException {
		resultsByDay = new HashMap<String, List<HashMap<String, String>>>();
		log("STARTING " + packageName);
		if (new File(this.logPath).exists()) {
			log(String.format("Reading files from : %s", this.logPath));
			File[] allFiles = new File(logPath).listFiles();
			List<File> files = filterByFileNames(allFiles);
			
			List<HashMap<String, String>> data  = new ArrayList<HashMap<String,String>>();
			for (File file : files) {
				data.addAll(parseFile(file, packageName));
			}
			System.out.println(data.size());
			writeResult(outputPath, new Gson().toJson(data), packageName);
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
	private ArrayList<HashMap<String, String>> parseFile(File file, String packageMethodName) throws IOException {
		ArrayList<HashMap<String, String>> data = new ArrayList<HashMap<String, String>>();
		log(String.format("Parsing file %s \t )  Package: %s ", file.getName(), packageMethodName));
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
								data.add(obj);
							} catch (Exception e) {
							}
						}
					}
				}
			}
		} finally {
			br.close();
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
		SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss,SSS", Locale.FRANCE);
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

	private static HashMap<String, String> getRow(String methodName, String time, String duration, String message, String cause, String params) {
		SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss,SSS", Locale.FRANCE);
		HashMap<String, String> keys = new HashMap<String, String>();
		keys.put("time", sdf.format(new Date(Long.parseLong(time))));
		keys.put("method", methodName);
		keys.put("duration", duration);
		keys.put("message", message);
		keys.put("cause", cause);
		keys.put("params", params);

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
