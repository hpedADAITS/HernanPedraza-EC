# Java API Documentation

## Table of Contents

### Classes
- [LoginController](#logincontroller)
- [TasksController](#taskscontroller)
- [Launch](#launch)
- [AppState](#appstate)
- [Task](#task)
- [User](#user)
- [DatabaseService](#databaseservice)
- [UIStyleManager](#uistylemanager)
- [AddTaskView](#addtaskview)
- [LoginView](#loginview)
- [MainView](#mainview)
- [SplashScreen](#splashscreen)


## Package

```
analyzed
```

## Summary

- **Classes:** 12
- **Interfaces:** 0
- **Dependencies:** 35

## Imports

- `Service.DatabaseService`
- `View.MainView`
- `View.AddTaskView`
- `Model.Task`
- `java.sql.SQLException`
- `java.util.ArrayList`
- `java.util.List`
- `javax.swing.JPanel`
- `View.LoginView`
- `View.SplashScreen`
- `java.util.prefs.Preferences`
- `java.time.LocalDateTime`
- `java.time.format.DateTimeFormatter`
- `java.io.BufferedReader`
- `java.nio.file.Files`
- `java.nio.file.Path`
- `java.nio.file.Paths`
- `java.sql.*`
- `java.util.logging.Level`
- `java.util.logging.Logger`
- `java.util.stream.Collectors`
- `com.formdev.flatlaf.FlatDarculaLaf`
- `javax.swing.*`
- `java.awt.*`
- `java.io.InputStream`
- `Utils.UIStyleManager`
- `Controller.TasksController`
- `java.awt.event.ActionEvent`
- `java.awt.event.ItemEvent`
- `java.util.HashMap`
- `java.util.Map`
- `Controller.LoginController`
- `java.awt.event.*`
- `java.text.SimpleDateFormat`
- `java.util.Date`

## Classes

### LoginController

Utility class: LoginController

**Fields:**

| Type | Name |
|------|------|
| `package` | `Controller` |
| `DatabaseService` | `databaseService` |
| `boolean` | `success` |
| `return` | `success` |
| `boolean` | `success` |
| `return` | `success` |

**Methods:**

- **LoginController** (): `public`
  > The provided code snippet `LoginController.LoginController` appears to be an incomplete or malformed Java declaration. In valid Java syntax:
- **login** (username: String, password: String): `boolean`
  > The `LoginController.login` method is a handler within the `LoginController` class that processes login requests and returns a boolean value indicating whether authentication was successful. Its primary purpose is to validate user credentials (such as username and password) against stored data, typically via a service layer or database. The method likely performs input validation, checks session state, invokes an authentication service, and returns `true` if the credentials are valid and access is granted, otherwise `false`. It does not directly manage sessions or redirect users but serves as a boolean flag for further application logic (e.g., granting access to protected routes). Security considerations such as password hashing, input sanitization, and rate limiting should be implemented in supporting layers.
- **register** (username: String, password: String, email: String): `boolean`
  > The method `LoginController.register` is a controller-level endpoint in a web application responsible for processing user registration requests. It typically accepts input parameters such as username, password, and possibly email, validates the provided data (e.g., uniqueness of credentials, format compliance), and persists the new user account into the underlying data store (e.g., database). If registration is successful, it returns `true`; otherwise, it returns `false`. This method serves as a core entry point for user onboarding and ensures secure, validated creation of user accounts. Note: Without actual source code, this description assumes standard implementation patterns; specific behaviors depend on validation logic, error handling, and integration with authentication services or databases.
- **getUsername** (): `String`
- **createTask** (name: String): `void`
- **launchMainView** (): `void`
- **launchAddTask** (): `void`

### TasksController

Utility class: TasksController

**Fields:**

| Type | Name |
|------|------|
| `package` | `Controller` |
| `TasksController` | `instance` |
| `DatabaseService` | `databaseService` |
| `MainView` | `mainView` |
| `String` | `username` |
| `List<Task>` | `allTasks` |
| `List<Task>` | `completedTasks` |
| `List<Task>` | `backlogTasks` |
| `return` | `instance` |
| `List<Task>` | `filteredTasks` |
| `return` | `filteredTasks` |
| `JPanel` | `taskPanel` |
| `boolean` | `success` |
| `return` | `success` |
| `return` | `username` |

**Methods:**

- **TasksController** (): `private`
  > Unable to generate AI description at this time.
- **getInstance** (): `TasksController`
  > Unable to generate AI description at this time.
- **setMainView** (mainView: MainView): `void`
  > Unable to generate AI description at this time.
- **loadTasksFromDatabase** (): `void`
- **getTasks** (completedOnly: boolean, backlogOnly: boolean): `List<Task>`
- **reloadTasksInMainView** (): `void`
- **deleteTask** (taskId: int): `void`
- **CreateTask** (name: String, type: String, recurrence_pattern: String): `void`
- **setTaskAsFinished** (taskId: int): `void`
- **login** (uUsername: String, uPassword: String): `boolean`
- **getUsernameFromService** (): `String`

### Launch

Utility class: Launch

**Fields:**

| Type | Name |
|------|------|
| `Preferences` | `prefs` |
| `String` | `SPLASH_SHOWN` |

**Methods:**

- **main** (args: String[]): `void`
  > Unable to generate AI description at this time.
- **isFirstLaunch** (): `boolean`
  > Unable to generate AI description at this time.
- **setSplashShown** (): `void`
  > The method `Launch.setSplashShown` is a static method in the `Launch` class that likely controls whether a splash screen is displayed during application startup.

### AppState

AppState manages application state, including detecting first launches and tracking splash screen display.

**Fields:**

| Type | Name |
|------|------|
| `Preferences` | `prefs` |
| `String` | `SPLASH_SHOWN` |

**Methods:**

- **main** (args: String[]): `void`
  > The method `AppState.main` is the entry point of a Java application, typically defined as a static method in the `AppState` class. Its primary purpose is to initialize and execute the main logic of the application when the program starts.
- **isFirstLaunch** (): `boolean`
  > The expression `AppState.isFirstLaunch` is a static boolean property (or method) in the `AppState` class that indicates whether the application has been launched for the first time.  
- **setSplashShown** (): `void`
  > The method `AppState.setSplashShown` is a static method in the `AppState` class that sets a flag indicating whether the splash screen has been displayed. It typically takes a boolean parameter (e.g., `true` to indicate the splash screen was shown, `false` otherwise) and updates an internal state variable within the `AppState` singleton or static instance to track app launch behavior.

### Task

A Task class represents a task with attributes such as ID, user ID, name, type, and due date.

**Fields:**

| Type | Name |
|------|------|
| `package` | `Model` |
| `int` | `id` |
| `int` | `userId` |
| `String` | `name` |
| `String` | `taskType` |
| `String` | `dueDate` |
| `String` | `recurrencePattern` |
| `boolean` | `isCompleted` |
| `LocalDateTime` | `createdAt` |
| `return` | `id` |
| `return` | `userId` |
| `return` | `name` |
| `return` | `taskType` |
| `return` | `dueDate` |
| `return` | `recurrencePattern` |
| `return` | `isCompleted` |
| `return` | `createdAt` |
| `return` | `false` |
| `DateTimeFormatter` | `formatter` |
| `LocalDateTime` | `taskDueDate` |
| `return` | `false` |

**Methods:**

- **getId** (): `int`
  > The method `getById` in the `Task` class is not valid based on standard Java naming conventions or typical usage. A method named `getById` would typically be used to retrieve a Task object by its ID, implying it takes an integer parameter (the ID) and returns a `Task` instance — not an `int`.
- **getUserId** (): `int`
  > The method `getUserId()` in the `Task` class is a public accessor method that retrieves the user ID associated with a task. It returns an integer value representing the identifier of the user who created or is linked to the task. This method enables other parts of the application to access the user identity tied to a specific task, supporting functionality such as ownership tracking, authorization checks, or reporting. The exact source of the user ID (e.g., stored in a field like `userId` within the Task object) is not specified, but it implies that this value is either set during task creation or assignment and is maintained throughout the task's lifecycle. No side effects are expected; it is a pure getter method with no parameters or state modification.
- **getName** (): `String`
  > The method `getName()` in the `Task` class is a public accessor method that retrieves the name of the task as a `String`. Its primary purpose is to provide read-only access to the task's name attribute, enabling other parts of the system to obtain or display the task's identifier or label. This method typically follows standard Java naming conventions for getter methods and assumes the presence of an internal `name` field (likely private) that stores the task's descriptive name. It does not modify any state; it is purely a read operation, promoting encapsulation and data integrity.
- **getTaskType** (): `String`
- **getDueDate** (): `String`
- **getRecurrencePattern** (): `String`
- **isCompleted** (): `boolean`
- **getCreatedAt** (): `LocalDateTime`
- **isBacklog** (): `boolean`
- **toString** (): `String`
- **setIsCompleted** (isCompleted: boolean): `void`

### User

The User class represents a user with a username and password, providing methods to initialize, retrieve, and modify these attributes.

**Fields:**

| Type | Name |
|------|------|
| `package` | `Model` |
| `String` | `username` |
| `String` | `password` |
| `return` | `username` |
| `return` | `password` |

**Methods:**

- **User** (username: String, password: String): `public`
  > The provided snippet "User.User" and context indicating "Class: User, Method returns public" are insufficient to provide a meaningful technical analysis.  
- **getUsername** (): `String`
  > The method `getUsername()` is a public accessor method belonging to the `User` class. It retrieves and returns the username associated with an instance of the `User` class as a `String`. This method follows standard Java naming conventions for getter methods (using camelCase) and adheres to encapsulation principles by providing controlled access to the private username field without exposing its internal implementation. The returned value is typically used in authentication, user identification, or display purposes within applications. No parameters are required, indicating it operates on instance data only.
- **getPassword** (): `String`
  > The method `getPassword` in the `User` class is a getter method that retrieves the password value associated with a user instance. It is designed to return a `String` representing the user's password.  
- **setUsername** (username: String): `void`
- **setPassword** (password: String): `void`

### DatabaseService

A DatabaseService class provides methods to retrieve credentials, establish a database connection, check if a database exists, and execute queries returning result counts.

**Fields:**

| Type | Name |
|------|------|
| `package` | `Service` |
| `Connection` | `connection` |
| `String` | `username` |
| `String` | `password` |
| `Logger` | `logger` |
| `return` | `username` |
| `return` | `password` |
| `String` | `url` |
| `return` | `connection` |
| `String` | `dbName` |
| `return` | `false` |
| `String` | `query` |
| `Statement` | `stmt` |
| `return` | `false` |
| `return` | `0` |
| `String` | `sql` |
| `Connection` | `conn` |
| `return` | `0` |
| `return` | `false` |
| `String` | `sql` |
| `Connection` | `conn` |
| `ResultSet` | `rs` |
| `return` | `true` |
| `return` | `false` |
| `String` | `checkSql` |
| `String` | `insertSql` |
| `Connection` | `conn` |
| `ResultSet` | `rs` |
| `return` | `false` |
| `int` | `rowsInserted` |
| `return` | `true` |
| `return` | `false` |
| `List<Task>` | `tasks` |
| `return` | `tasks` |
| `PreparedStatement` | `stmt` |
| `Task` | `task` |
| `return` | `tasks` |
| `int` | `id` |
| `int` | `userId` |
| `String` | `name` |
| `String` | `taskType` |
| `String` | `dueDate` |
| `String` | `recurrence` |
| `boolean` | `completed` |
| `LocalDateTime` | `createdAt` |
| `WHERE` | `is_completed` |
| `WHERE` | `is_completed` |
| `AND` | `is_completed` |
| `Connection` | `conn` |
| `String` | `deleteQuery` |
| `Connection` | `conn` |
| `int` | `rowsAffected` |
| `throw` | `e` |
| `String` | `sql` |
| `Connection` | `conn` |
| `to` | `completed` |
| `String` | `dbName` |
| `Path` | `sqlFilePath` |
| `String` | `sql` |
| `String` | `trimmed` |
| `Statement` | `stmt` |
| `return` | `false` |

**Methods:**

- **getUsername** (): `String`
  > The `getUsername` method in the `DatabaseService` class is designed to retrieve a user's username from a persistent database. It typically executes a query (e.g., SQL SELECT) against a database table containing user account data, using an identifier such as a user ID or email to locate and return the corresponding username. The method assumes that the database schema includes a column for usernames and that appropriate authentication or lookup logic is in place. 
- **getPassword** (): `String`
  > The `getPassword()` method in the `DatabaseService` class is designed to retrieve a password, typically used for database authentication. However, due to security best practices, directly exposing or returning passwords from a service class is highly discouraged. This method likely returns a stored credential (e.g., a hardcoded or configuration-based password) intended for internal use in establishing database connections.
- **connect** (): `Connection`
  > The `DatabaseService.connect()` method is a static utility method within the `DatabaseService` class that establishes a database connection. Its primary purpose is to initialize and return a `java.sql.Connection` object representing a session with a configured database (e.g., MySQL, PostgreSQL, etc.). 
- **databaseExists** (): `boolean`
- **executeQuery** (sql: String): `int`
- **updateTask** (task: Task): `int`
- **login** (username: String, password: String): `boolean`
- **register** (username: String, password: String, email: String): `boolean`
- **getTasksByQuery** (sql: String): `List<Task>`
- **extractTaskFromResultSet** (rs: ResultSet): `Task`
- **getAllTasks** (): `List<Task>`
- **getCompletedTasks** (): `List<Task>`
- **getBacklogTasks** (): `List<Task>`
- **createTask** (name: String, type: String, recurrence_pattern: String): `void`
- **deleteTaskById** (taskId: int): `void`
- **updateTaskCompletionStatus** (taskId: int, isCompleted: boolean): `void`
- **markTaskAsCompleted** (taskId: int): `void`
- **initializeDatabaseIfMissing** (): `void`
- **for** (sql.split(";"): String statement :): `separately`
- **databaseExists** (conn: Connection, dbName: String): `boolean`

### UIStyleManager

The UIStyleManager class handles theme application, font loading, rounded frame styling, component resizing events, and image drawing with quality optimization.

**Fields:**

| Type | Name |
|------|------|
| `package` | `Utils` |
| `Color` | `DARK_BG` |
| `Font` | `font` |
| `return` | `font` |
| `Graphics2D` | `g2d` |

**Methods:**

- **applyDarkTheme** (): `void`
  > The `UIStyleManager.applyDarkTheme()` method is a utility function within the `UIStyleManager` class that applies a dark theme to the user interface elements of an application.  
- **loadFont** (fontPath: String, size: float): `Font`
  > The method `UIStyleManager.loadFont` is responsible for loading a font resource from the system or configuration within the UI framework. It belongs to the `UIStyleManager` class, which manages visual styling components (such as fonts, colors, layouts) of user interface elements.
- **applyRoundedFrame** (frame: JFrame, arcWidth: int, arcHeight: int): `void`
  > The method `UIStyleManager.applyRoundedFrame` is a utility function within the `UIStyleManager` class that applies a rounded frame style to user interface elements. 
- **componentResized** (e: java.awt.event.ComponentEvent): `void`
- **qualityImageDraw** (g: Graphics, c: Component, image: Image): `void`

### AddTaskView

AddTaskView is a Java class that provides a graphical interface for adding tasks, featuring event handling and a main method for execution.

**Inheritance:**

- Extends: `JFrame`

**Fields:**

| Type | Name |
|------|------|
| `package` | `View` |
| `JComboBox<String>` | `taskTypeCombo` |
| `JPanel` | `schedulePanel` |
| `Font` | `oswaldFont` |
| `Font` | `font` |
| `JLabel` | `imageLabel` |
| `Image` | `scaledImage` |
| `JPanel` | `imagePanel` |
| `JPanel` | `formPanel` |
| `GridBagConstraints` | `gbc` |
| `JLabel` | `nameLabel` |
| `JTextField` | `taskNameField` |
| `Image` | `scaledTaskIcon` |
| `JLabel` | `iconLabel` |
| `JPanel` | `iconPanel` |
| `JPanel` | `taskFieldPanel` |
| `JLabel` | `typeLabel` |
| `Map<String, JCheckBox>` | `checkBoxes` |
| `JLabel` | `dayLabel` |
| `JCheckBox` | `checkBox` |
| `JButton` | `addButton` |
| `String` | `name` |
| `String` | `type` |
| `String` | `recurrencePattern` |
| `InputMap` | `inputMap` |
| `ActionMap` | `actionMap` |
| `JSplitPane` | `splitPane` |
| `AddTaskView` | `view` |

**Methods:**

- **AddTaskView** (taskPanel: JPanel): `public`
  > The provided snippet "AddTaskView.AddTaskView" refers to a Java class named `AddTaskView` that appears to be part of a user interface (UI) component, likely in a mobile or desktop application using a framework such as Android (e.g., Jetpack Compose or View-based UI). The class name suggests it is responsible for displaying and managing the view associated with adding a new task.
- **AbstractAction** (): `new`
  > The `AddTaskView.AbstractAction` appears to be an abstract class within the `AddTaskView` component of a Java application, likely part of a GUI framework (such as Swing or JavaFX). Its primary purpose is to define a reusable action interface or base behavior for operations related to adding tasks—such as creating, submitting, or validating new task entries.
- **actionPerformed** (e: ActionEvent): `void`
  > The method `AddTaskView.actionPerformed` is an event handler in the Java Swing GUI framework that responds to user actions (such as button clicks) within the `AddTaskView` class. It is typically invoked by a listener registered on UI components like buttons or text fields, where the action event signifies a user-initiated operation—most commonly submitting a new task.
- **AddTaskView** (): `public`
  > The provided snippet "AddTaskView.AddTaskView" refers to a Java class named `AddTaskView` that appears to be part of a user interface (UI) component, likely in a mobile or desktop application using a framework such as Android (e.g., Jetpack Compose or View-based UI). The class name suggests it is responsible for displaying and managing the view associated with adding a new task.
- **main** (args: String[]): `void`

### LoginView

The LoginView class is a GUI component that handles login functionality through an action listener, with a main method for initialization and event-driven behavior via AbstractAction.

**Fields:**

| Type | Name |
|------|------|
| `package` | `View` |
| `Font` | `oswald` |
| `JFrame` | `window` |
| `JLabel` | `imageLabel` |
| `ImageIcon` | `imageIcon` |
| `Image` | `image` |
| `JPanel` | `imagePanel` |
| `JPanel` | `panel` |
| `GridBagConstraints` | `gbc` |
| `JTextField` | `usernameField` |
| `JPasswordField` | `passwordField` |
| `JPanel` | `buttonsPanel` |
| `JButton` | `loginButton` |
| `JButton` | `registerButton` |
| `String` | `username` |
| `String` | `password` |
| `LoginController` | `controller` |
| `boolean` | `success` |
| `String` | `username` |
| `String` | `password` |
| `String` | `email` |
| `LoginController` | `controller` |
| `boolean` | `success` |
| `InputMap` | `inputMap` |
| `ActionMap` | `actionMap` |
| `JSplitPane` | `splitPane` |

**Methods:**

- **main** (): `void`
  > The provided code snippet refers to `LoginView.main` within a class named `LoginView`, but no actual Java source code is included for analysis. As such, a technical description cannot be accurately generated based on executable logic or structure.
- **AbstractAction** (): `new`
  > The identifier `LoginView.AbstractAction` appears to refer to an abstract action class or interface within the `LoginView` component of a Java application—likely part of a GUI framework such as Swing or a custom view architecture.
- **actionPerformed** (e: ActionEvent): `void`
  > The method `LoginView.actionPerformed` is an event handler in a Java Swing application that responds to user actions, typically button clicks or other interactive events on the login interface. As part of the LoginView class, it is likely invoked when a user submits login credentials (e.g., by clicking a "Login" button).  

### MainView

The MainView class initializes and sets up a main application window by configuring its UI style, layout, and integrating with a login controller.

**Inheritance:**

- Extends: `JFrame`

**Fields:**

| Type | Name |
|------|------|
| `package` | `View` |
| `JLabel` | `viewLabel` |
| `Font` | `oswaldFont` |
| `TasksController` | `tasksController` |
| `boolean` | `showingCompleted` |
| `boolean` | `showingBacklog` |
| `LoginController` | `loginController` |
| `JPanel` | `messagePanel` |
| `JPanel` | `taskPanel` |
| `JScrollPane` | `taskScrollPane` |
| `JButton` | `addTaskButton` |
| `LoginController` | `controller` |
| `JPanel` | `buttonPanel` |
| `String` | `username` |
| `JLabel` | `welcomeLabel` |
| `JLabel` | `dateLabel` |
| `JPanel` | `messagePanel` |
| `GridBagConstraints` | `gbc` |
| `return` | `messagePanel` |
| `JPanel` | `taskPanel` |
| `return` | `taskPanel` |
| `JScrollPane` | `scrollPane` |
| `return` | `scrollPane` |
| `JScrollPane` | `scrollPane` |
| `JPanel` | `panel` |
| `JButton` | `mainTasksButton` |
| `JButton` | `completedTasksButton` |
| `JButton` | `backlogTasksButton` |
| `return` | `panel` |
| `List<Task>` | `tasks` |
| `ImageIcon` | `taskIcon` |
| `Image` | `taskImage` |
| `JButton` | `deleteButton` |
| `JLabel` | `label` |
| `Timer` | `timer` |
| `return` | `taskBox` |
| `ImageIcon` | `icon` |
| `Image` | `scaled` |
| `JButton` | `button` |
| `return` | `button` |
| `ImageIcon` | `deleteIcon` |
| `Image` | `scaled` |
| `JButton` | `button` |
| `return` | `button` |

**Methods:**

- **MainView** (loginController: LoginController): `public`
  > The provided identifier `MainView.MainView` refers to a class named `MainView` that likely defines the main user interface or entry point of a Java application. However, the snippet lacks actual code — only a class name and context indicating it returns "public."
- **initialize** (): `void`
  > The method `MainView.initialize()` is a static initializer method in the `MainView` class that is responsible for setting up or configuring the initial state of the main view component. Since it is declared as static, it is invoked before any instances of `MainView` are created and typically runs once during application startup.
- **setupUIStyle** (): `void`
  > The method `MainView.setupUIStyle` is responsible for configuring the user interface (UI) styling of the `MainView` class. Although the exact implementation is not provided, based on naming conventions and typical Java GUI patterns, this method likely initializes or applies visual properties such as font styles, colors, background settings, padding, margins, or layout themes to ensure a consistent and aesthetically aligned UI appearance.
- **createMainWindow** (): `void`
- **setupLayout** (): `void`
- **createMessagePanel** (): `JPanel`
- **setCurrentViewLabel** (viewName: String): `void`
- **createTaskPanel** (): `JPanel`
- **createTaskScrollPane** (taskPanel: JPanel): `JScrollPane`
- **getTaskPanel** (): `JPanel`
- **createIconButtonPanel** (addTaskButton: JButton): `JPanel`
- **reloadTaskPanel** (taskPanel: JPanel): `void`
- **createTaskBox** (task: Task): `JPanel`
- **JPanel** (null: ): `new`
- **paintComponent** (g: Graphics): `void`
- **getPreferredSize** (): `Dimension`
- **MouseAdapter** (): `new`
- **mouseClicked** (e: MouseEvent): `void`
- **createIconButton** (iconFile: String, tooltipText: String): `JButton`
- **getFormattedDate** (): `String`
- **createDeleteButton** (taskId: int): `JButton`

### SplashScreen

A SplashScreen class that initializes and displays a splash screen with an optional duration parameter.

**Inheritance:**

- Extends: `JWindow`

**Fields:**

| Type | Name |
|------|------|
| `package` | `View` |
| `int` | `width` |
| `int` | `height` |
| `ImageIcon` | `splashIcon` |
| `JLabel` | `splashLabel` |

**Methods:**

- **SplashScreen** (): `public`
  > The provided snippet `SplashScreen.SplashScreen` refers to a class named `SplashScreen` that likely contains a constructor or method named `SplashScreen`, which is publicly accessible. However, based on the given information—only the class name and context—it cannot be definitively determined what specific behavior the code implements.
- **showSplash** (durationMillis: int): `void`
  > The method `SplashScreen.showSplash()` is a static method belonging to the `SplashScreen` class. Its purpose is to display a splash screen — typically an initial graphical interface that appears when an application starts, often used for branding or indicating loading progress.

