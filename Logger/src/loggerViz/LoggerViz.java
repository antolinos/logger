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

	
	private final static String logPath = "N:/prod_logs";
	private final static String outputPath = "C://opt//apache-tomcat-7.0.25//webapps//logger//BIOSAXS_WS.js";
	private final static String outputPathUI = "C://opt//apache-tomcat-7.0.25//webapps//logger//BIOSAXS_UI.js";
	private final static String outputPathUIError = "C://opt//apache-tomcat-7.0.25//webapps//logger//BIOSAXS_UI_ERROR.js";
	private final static String outputPathMobile = "C://opt//apache-tomcat-7.0.25//webapps//logger//BIOSAXS_MOBILE.js";
	private final static String outputPathLogin = "C://opt//apache-tomcat-7.0.25//webapps//logger//BIOSAXS_LOGIN.js";
	
	private final static HashSet<String> excludedMethods = new HashSet<String>(Arrays.asList("GETIMAGE", "GETANALYSISINFORMATIONBYEXPERIMENTID", "GETABINITIOIMAGE"));
	
	public static void main(String[] args) throws IOException {
		new Thread(new ParserThread(logPath,"BIOSAXS_MOBILE", outputPathMobile, excludedMethods)).start();
		new Thread(new ParserThread(logPath,"BIOSAXS_WS", outputPath, excludedMethods)).start();
		new Thread(new ParserThread(logPath,"BIOSAXS_UI", outputPathUI, excludedMethods)).start();
		new Thread(new ParserThread(logPath,"_ERROR", outputPathUIError, excludedMethods)).start();
		new Thread(new ParserThread(logPath,"LOGIN", outputPathLogin, excludedMethods)).start();
		
	}





	
	
	
}
