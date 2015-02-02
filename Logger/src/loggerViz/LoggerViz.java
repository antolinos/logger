package loggerViz;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;

public class LoggerViz {

	// private final static String outputFolder =
	// "/opt/ademaria/tomcat/webapps/logger";

	private final static HashSet<String> excludedMethods = new HashSet<String>(Arrays.asList("GETIMAGE", "GETANALYSISINFORMATIONBYEXPERIMENTID", "GETABINITIOIMAGE"));

	public static void main(String[] args) throws IOException {

		String sources = Arrays.asList(args).get(0);
		System.out.println("Sources are on: " + sources);

		String outputFolder = Arrays.asList(args).get(1);
		System.out.println("Output folder is: " + outputFolder);

		String logPath = "/user/ademaria/Documents/ISPyB/logger/files/";
		String outputPath = outputFolder + "/BIOSAXS_WS.js";
		String outputPathUI = outputFolder + "/BIOSAXS_UI.js";
		String outputPathUIError = outputFolder + "/BIOSAXS_UI_ERROR.js";
		String outputPathMobile = outputFolder + "/BIOSAXS_MOBILE.js";
		String outputPathLogin = outputFolder + "/BIOSAXS_LOGIN.js";

		// new Thread(new ParserThread(sources,"BIOSAXS_MOBILE",
		// outputPathMobile, excludedMethods)).start();
		new Thread(new ParserThread(sources, "BIOSAXS_WS", outputPath, excludedMethods)).start();
		// new Thread(new ParserThread(sources,"BIOSAXS_UI", outputPathUI,
		// excludedMethods)).start();
		// new Thread(new ParserThread(sources,"_ERROR", outputPathUIError,
		// excludedMethods)).start();
		// new Thread(new ParserThread(sources,"LOGIN", outputPathLogin,
		// excludedMethods)).start();

	}

}
