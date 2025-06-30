<h2>Create / Edit Task</h2>
<form method="post" action="editor.php">
    <input type="hidden" name="id" id="form-id" />
    <input type="hidden" name="change_type" id="form-change-type" />
    <label>Title: <input name="title" id="form-title" required /></label><br>
    <label>Description: <textarea name="description" id="form-description"></textarea></label><br>
    <label>Date: <input type="date" name="date" id="form-date" /></label><br>
    <label>Tag:
        <select name="tag" id="form-tag">
            <option value="update">Update</option>
            <option value="new">New</option>
            <option value="improvement">Improvement</option>
            <option value="fix">Fix</option>
            <option value="future">Future</option>
        </select>
    </label><br>
    <label>Category: <input name="category" id="form-category" /></label><br>
    <label><input type="checkbox" name="done" id="form-done" /> Done</label><br>
    <button type="submit">Save Task</button>
    <button type="submit" name="delete" onclick="return confirm('Are you sure?')">Delete Task</button>
</form>