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

The LoginController class handles user authentication and registration, provides username retrieval, and allows creating tasks after login.

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
  > The provided code snippet `LoginController.LoginController` appears to be an incomplete or malformed specification. It references a class named `LoginController` with a constructor `LoginController.LoginController`, which is not standard Java syntax — constructors do not have explicit return types (including `public`) and are not typically described as "returning public" since they do not return values.
- **login** (username: String, password: String): `boolean`
  > The `LoginController.login` method is a public endpoint in a web application that handles user authentication requests. It receives login credentials (typically username and password) via an HTTP request, validates them against stored user data (e.g., using a service layer or database), and returns a boolean value indicating whether the login was successful.
- **register** (username: String, password: String, email: String): `boolean`
  > The method `LoginController.register` is a member function within the `LoginController` class that handles user registration functionality. Its primary purpose is to process registration requests—typically receiving user input (such as username, password, email)—validating it against business or security rules, and storing the data in a persistent storage system (e.g., database). The method returns a boolean value: `true` indicates successful registration, and `false` signifies failure due to validation errors, duplicate entries, or other issues. This method is typically part of a RESTful API or web application flow where users create new accounts. Important technical details include input validation, potential use of cryptographic password hashing (e.g., bcrypt), uniqueness checks (e.g., unique email/username), and integration with authentication services or data persistence layers.
- **getUsername** (): `String`
- **createTask** (name: String): `void`
- **launchMainView** (): `void`
- **launchAddTask** (): `void`

### TasksController

The TasksController manages task data by loading it from a database and providing access to tasks based on filters, while ensuring singleton pattern through private constructor and instance retrieval.

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
  > The provided code snippet refers to a class named `TasksController` within a Java application, likely part of a web-based RESTful API (e.g., using Spring Boot). However, the specific implementation or method body is not included in the input.
- **getInstance** (): `TasksController`
  > The expression `TasksController.getInstance()` retrieves a singleton instance of the `TasksController` class. 
- **setMainView** (mainView: MainView): `void`
  > The method `TasksController.setMainView` is a member function of the `TasksController` class in a Java application. Its primary purpose is to set or update the main view associated with the controller, typically used in a model-view-controller (MVC) architecture to manage user interface presentation.
- **loadTasksFromDatabase** (): `void`
- **getTasks** (completedOnly: boolean, backlogOnly: boolean): `List<Task>`
- **reloadTasksInMainView** (): `void`
- **deleteTask** (taskId: int): `void`
- **CreateTask** (name: String, type: String, recurrence_pattern: String): `void`
- **setTaskAsFinished** (taskId: int): `void`
- **login** (uUsername: String, uPassword: String): `boolean`
- **getUsernameFromService** (): `String`

### Launch

The Launch class handles application startup logic, including detecting if it's the first launch and managing splash screen display.

**Fields:**

| Type | Name |
|------|------|
| `Preferences` | `prefs` |
| `String` | `SPLASH_SHOWN` |

**Methods:**

- **main** (args: String[]): `void`
  > The provided information is insufficient for a meaningful technical analysis.
- **isFirstLaunch** (): `boolean`
  > The `Launch.isFirstLaunch` method in the `Launch` class is a static method that returns a boolean value indicating whether the application is being launched for the first time. 
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
  > The method `AppState.main` is a static entry point in the `AppState` class, typically used as the starting point for execution in a Java application. As a main method, it serves as the program's initialization point, often invoking other methods or initializing components of the application state.
- **isFirstLaunch** (): `boolean`
  > The expression `AppState.isFirstLaunch` is a static boolean property (or method) in the `AppState` class that indicates whether the application has been launched for the first time. 
- **setSplashShown** (): `void`
  > The method `AppState.setSplashShown` is a static method in the `AppState` class that sets a boolean flag indicating whether the splash screen has been displayed. 

### Task

A Task class represents a task with properties such as ID, user ID, name, type, and due date.

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
  > The method `getById` in the `Task` class is not valid based on standard Java naming conventions and typical usage. A method named `getById` would typically be used to retrieve a task by an ID (e.g., `int getId()`), but the provided context states that "Method returns int", which suggests it might be intended as `getId()`, not `getById`.
- **getUserId** (): `int`
  > The method `getUserId` in the `Task` class is a public accessor method that retrieves an integer representing the user ID associated with a task. Its primary purpose is to provide read-only access to the user identifier that links the task to a specific user entity. This method typically operates by returning a stored instance variable (e.g., `private int userId`) and does not modify any state. It assumes that the task object has been initialized with a valid user ID, and its behavior depends on proper instantiation or assignment of this field. No parameters are required, as it directly accesses the internal state of the Task object. This method supports data consistency and enables downstream systems (e.g., logging, permissions checks) to identify which user created or is associated with a given task.
- **getName** (): `String`
  > The method `getName()` in the `Task` class is a public accessor method that retrieves the name of the task as a `String`. Its primary purpose is to provide read-only access to the task's name attribute, allowing external code to obtain the task identifier or label for display, logging, or processing purposes. This method typically follows standard Java naming conventions and assumes that the task instance has a private `name` field (e.g., of type `String`) which is accessed via getter logic. No side effects are performed; it simply returns the current value of the name property. The method is fundamental for object representation and interoperability in systems where task identification is required.
- **getTaskType** (): `String`
- **getDueDate** (): `String`
- **getRecurrencePattern** (): `String`
- **isCompleted** (): `boolean`
- **getCreatedAt** (): `LocalDateTime`
- **isBacklog** (): `boolean`
- **toString** (): `String`
- **setIsCompleted** (isCompleted: boolean): `void`

### User

A User class represents a user with a username and password, allowing setting and retrieving of these credentials.

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
  > The provided snippet "User.User" appears to be an incomplete or malformed reference. In Java, a class named `User` would typically be defined with a class declaration such as:
- **getUsername** (): `String`
  > The method `getUsername()` is a public accessor method in the `User` class that retrieves and returns the username of an instance of the `User` class as a `String`. Its primary purpose is to provide controlled access to the user's username attribute, enabling other parts of the system to read the value without directly accessing the internal state. This method follows standard Java encapsulation principles, promoting data integrity by preventing direct modification of the username from external code. It assumes that the username is stored as a private field within the `User` class and is accessed via getter pattern (also known as "getter" or "accessor" method). No parameters are required, and it does not modify the object's state—making it a pure read operation.
- **getPassword** (): `String`
  > The method `User.getPassword()` is an instance method of the `User` class that retrieves and returns the password associated with a user object as a `String`. 
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
  > The `getUsername` method in the `DatabaseService` class is designed to retrieve a user's username from a persistent database. It typically executes a database query (e.g., using JDBC or an ORM like JPA/Hibernate) to fetch the username based on a provided identifier such as user ID, email, or authentication token. The method assumes the existence of a data source and schema that maps users to their credentials.
- **getPassword** (): `String`
  > The method `DatabaseService.getPassword()` is a static method within the `DatabaseService` class that is intended to retrieve a password, typically used for database authentication. Its primary purpose is to provide access to a sensitive credential (such as a database password) stored securely within the service's configuration or data source.
- **connect** (): `Connection`
  > The `DatabaseService.connect()` method is a static utility method within the `DatabaseService` class that establishes a database connection. Its primary purpose is to initialize and return a `java.sql.Connection` object representing a session with a specified database (e.g., MySQL, PostgreSQL). 
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

The UIStyleManager class handles theming, font loading, rounded frame application, and image rendering for GUI components in a Java Swing application.

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
  > The method `UIStyleManager.applyDarkTheme()` is a static utility method within the `UIStyleManager` class that applies a dark theme to the user interface elements of an application. Its primary purpose is to modify visual styling—such as background colors, text colors, button appearances, and other UI components—to use darker color schemes, typically enhancing readability in low-light environments or reducing eye strain.
- **loadFont** (fontPath: String, size: float): `Font`
  > **Technical Description:**
- **applyRoundedFrame** (frame: JFrame, arcWidth: int, arcHeight: int): `void`
  > The method `UIStyleManager.applyRoundedFrame` is designed to apply a rounded frame styling effect to UI components within a graphical user interface. 
- **componentResized** (e: java.awt.event.ComponentEvent): `void`
- **qualityImageDraw** (g: Graphics, c: Component, image: Image): `void`

### AddTaskView

AddTaskView is a Java class that provides a graphical interface for adding tasks, featuring event handling and a main method for program execution.

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
  > The provided code snippet `AddTaskView.AddTaskView` appears to refer to a class named `AddTaskView`, likely part of a Java-based user interface (UI) application—possibly in a mobile or desktop environment using frameworks like Android (with Jetpack Compose or XML UI components) or Swing/JavaFX.
- **AbstractAction** (): `new`
  > The entity `AddTaskView.AbstractAction` appears to be an abstract action class (likely implementing a functional interface such as `Action` or `AbstractAction`) within the context of a GUI or view component named `AddTaskView`. It is likely used to define reusable, behavior-based actions—such as "add task", "cancel", or "save"—that can be bound to UI elements in the AddTaskView.
- **actionPerformed** (e: ActionEvent): `void`
  > The method `AddTaskView.actionPerformed` is an event handler in the `AddTaskView` class that responds to user actions (such as button clicks) within a graphical user interface (GUI). It typically receives an `ActionEvent` object via its parameter, which identifies the source of the action (e.g., a "Save" or "Add" button).
- **AddTaskView** (): `public`
  > The provided code snippet `AddTaskView.AddTaskView` appears to refer to a class named `AddTaskView`, likely part of a Java-based user interface (UI) application—possibly in a mobile or desktop environment using frameworks like Android (with Jetpack Compose or XML UI components) or Swing/JavaFX.
- **main** (args: String[]): `void`

### LoginView

The LoginView class is a graphical user interface component that handles login functionality through an event-driven design, using ActionListener to respond to user actions.

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
  > The provided code snippet refers to `LoginView.main`, which is a static method within the `LoginView` class. However, no actual Java code is supplied for analysis.
- **AbstractAction** (): `new`
  > The identifier `LoginView.AbstractAction` appears to refer to an abstract action class within a Java application's UI framework (likely using Swing or a similar event-driven system), where `LoginView` is a view component responsible for handling login functionality.
- **actionPerformed** (e: ActionEvent): `void`
  > The method `LoginView.actionPerformed` is an event handler in a Java Swing GUI application that responds to user actions such as clicking a login button.  

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
  > The provided identifier `MainView.MainView` refers to a class named `MainView` that is likely part of a Java application's user interface or main entry point. However, the snippet lacks actual code (e.g., method definitions, logic, or implementation), so a precise technical analysis cannot be performed.
- **initialize** (): `void`
  > The method `MainView.initialize()` is a static initializer method within the `MainView` class, typically responsible for setting up or configuring the initial state of the main view component in a GUI application (e.g., a JavaFX or Swing-based interface). 
- **setupUIStyle** (): `void`
  > The method `MainView.setupUIStyle` is responsible for configuring the user interface (UI) appearance of the `MainView` class. Although the exact implementation is not provided, based on the name and context, it likely applies styling rules—such as font sizes, colors, padding, layout constraints, or theme settings—to components within the main view. This method may set UI properties using standard Java Swing or JavaFX APIs (e.g., `setForeground()`, `setBackground()`, `setFont()`, or `getStyle()`), depending on the framework used.
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

A SplashScreen class that initializes and displays a splash screen with an optional duration specified by an integer.

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
  > The provided identifier `SplashScreen.SplashScreen` refers to a class named `SplashScreen` that is likely part of a Java application's UI initialization sequence. However, the given input lacks actual code content—only a class name and context indicating it returns public.
- **showSplash** (durationMillis: int): `void`
  > The method `SplashScreen.showSplash()` is a static method belonging to the `SplashScreen` class. Its purpose is to display a splash screen—typically an initial interface shown when an application starts up—to indicate that the app is loading or initializing.

