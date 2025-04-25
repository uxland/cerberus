# Gradle Wrapper JAR

This directory should contain the `gradle-wrapper.jar` file, which is a binary file that contains the code for the Gradle wrapper.

Since this file is binary and cannot be created directly through text commands, you'll need to generate it using one of the following methods:

## Method 1: Using Gradle

If you have Gradle installed, you can generate the wrapper files by running the following command from the project root:

```bash
gradle wrapper
```

## Method 2: Using the wrapper task

If you don't have Gradle installed, but have already set up the wrapper files (gradlew, gradlew.bat, and gradle-wrapper.properties), you can generate the gradle-wrapper.jar file by running the following command from the project root:

```bash
./gradlew wrapper
```

On Windows:

```bash
gradlew.bat wrapper
```

This will generate the gradle-wrapper.jar file in the gradle/wrapper directory.

## Method 3: Manual download

You can also manually download the gradle-wrapper.jar file from the Gradle website and place it in this directory.

The URL for the gradle-wrapper.jar file for Gradle 8.5 is:
https://github.com/gradle/gradle/raw/v8.5.0/gradle/wrapper/gradle-wrapper.jar