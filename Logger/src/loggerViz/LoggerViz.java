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
		System.out.println("Output path is: " + outputFolder);
		
		String pack =  Arrays.asList(args).get(2);
		System.out.println("Package: " +  pack);
		
		//new Thread(new ParserThread(sources, pack, outputFolder, excludedMethods)).start();
		
		new Thread(new ParserThread(sources, pack, outputFolder, excludedMethods, true)).start();
		new Thread(new ParserThread(sources, pack, outputFolder, excludedMethods, false)).start();

	}

}
