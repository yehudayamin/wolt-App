/*
 * A reusable labeled input field with built-in error display.
 * Used across Login.jsx and Register.jsx to avoid code duplication.
 */



// label — the text shown above the input field. Example: "Username"
// type — the type of the input. Example: "text", "password", "email"
// value — what is currently written in the field. Comes from the parent's state
// onChange — a function that runs every time the user types. Updates the parent's state
// error — an error message. Example: "Password too short". If no error — empty
// placeholder — the grey text inside the field before the user types
// inputRef — optional. Used to auto-focus the field when the screen loads
function InputField({ label, type, value, onChange, error, placeholder, inputRef })
{
    return(
        <div className="input-field">
            <label>{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                ref={inputRef}
            />
            {error && <span className="error-message">{error}</span>}
        </div>
    )
}

window.InputField=InputField