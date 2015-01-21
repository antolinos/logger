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

public class LoggerViz {

	private final static String outputFolder = "/opt/ademaria/tomcat/webapps/logger";
	private final static String logPath = "/user/ademaria/Documents/ISPyB/logger/files/";
	private final static String outputPath =  outputFolder + "/BIOSAXS_WS.js";
	private final static String outputPathUI = outputFolder + "/BIOSAXS_UI.js";
	private final static String outputPathUIError = outputFolder + "/BIOSAXS_UI_ERROR.js";
	private final static String outputPathMobile = outputFolder + "/BIOSAXS_MOBILE.js";
	private final static String outputPathLogin = outputFolder + "/BIOSAXS_LOGIN.js";
	
	private final static HashSet<String> excludedMethods = new HashSet<String>(Arrays.asList("GETIMAGE", "GETANALYSISINFORMATIONBYEXPERIMENTID", "GETABINITIOIMAGE"));
	
	public static void main(String[] args) throws IOException {
		
		
		String sources = Arrays.asList(args).get(0);
		System.out.println("Sources are on: " + sources);
		
		String outputFolder = Arrays.asList(args).get(1);
		System.out.println("Output folder is: " + outputFolder);
		
//		new Thread(new ParserThread(sources,"BIOSAXS_MOBILE", outputPathMobile, excludedMethods)).start();
		new Thread(new ParserThread(sources,"BIOSAXS_WS", outputPath, excludedMethods)).start();
//		new Thread(new ParserThread(sources,"BIOSAXS_UI", outputPathUI, excludedMethods)).start();
//		new Thread(new ParserThread(sources,"_ERROR", outputPathUIError, excludedMethods)).start();
//		new Thread(new ParserThread(sources,"LOGIN", outputPathLogin, excludedMethods)).start();
		
	}





	
	
	
}
