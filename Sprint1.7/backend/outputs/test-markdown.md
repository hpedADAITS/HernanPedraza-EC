# Java Documentation

## Table of Contents

### Classes
- [UserService](#userservice)
### Interfaces
- [UserRepository](#userrepository)


## Package

```
com.example.demo
```

## Imports

- `java.util.List`
- `java.util.ArrayList`

## Classes

### UserService

**Inheritance:**

- Implements: `UserRepository`

**Fields:**

| Type | Name |
|------|------|
| `String` | `name` |
| `List<User>` | `users` |

**Methods:**

- **addUser** (user: User): `void`
- **getUsers** (): `List<User>`

## Interfaces

### UserRepository

**Methods:**

- **findById** (id: String): `User`

