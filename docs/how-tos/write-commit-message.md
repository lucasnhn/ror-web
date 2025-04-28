[Back to README](README.md)

# How to - write commit message

## 1. Start with a type
The commit message should start with one of these types:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect code meaning (whitespace, formatting)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding or correcting tests
- `chore`: Other changes that don't modify src or test files

The project can introduce more types, one I like is `temp`, for when you commit to pull, so someone else can see, switch branches, or other reasons that are mainly because you "have to" commit.

## 2. Optionally add a scope
You can specify the part of the code this affects by adding a scope inside parentheses after the type.

**Example:**
```text
feat(web): add dropdown component
```

## 3. Write a short description
After the type (and optional scope), put a colon and a space, then a short, lowercase summary (imperative mood).

**Example:**
```text
feat(web): add dropdown component
```

## 4. Optional body
If necessary, after the short summary, add a blank line and:
- **Body**: Explain **what** and **why** in more detail.

**Example full commit:**
```text
feat(account): allow users to delete their account

This adds a new button on the settings page that triggers the delete request.
The backend endpoint was already available.
```

---

## Summary formula
```text
<type>(<scope>): <short summary>

<body>
```
