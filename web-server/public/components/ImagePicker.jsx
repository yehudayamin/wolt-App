/*

 * Allows users to pick a profile image from their computer during registration.
 * Shows an immediate preview of the selected image and converts it to base64.
 */

function ImagePicker({onImageSelect,error} )
{
// loads the file the user selected, converts it to base64 and shows a preview
const [preview, setPreview] = React.useState(null); //preview holds the base64 of the picture
function handleChange(event) {
    const file = event.target.files[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
        setPreview(reader.result)
        onImageSelect(reader.result)
    }
}

return (
    <div style={{ marginBottom: '16px' }}>
        <label style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)', display: 'block', marginBottom: '10px' }}>
            Profile Picture
        </label>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Preview circle — shows selected image or grey placeholder */}
            {preview
                ? <img src={preview} alt="Preview" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-color)' }} />
                : <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-secondary)', border: '2px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📷</div>
            }

            {/* Hidden real input — triggered by the styled label below */}
            <input id="image-upload" type="file" accept="image/*" onChange={handleChange} style={{ display: 'none' }} />

            {/* Styled blue label acts as the button */}
            <label htmlFor="image-upload" className="btn-primary" style={{ cursor: 'pointer', padding: '8px 20px', borderRadius: '8px', fontSize: '0.9rem' }}>
                {preview ? 'Change Photo' : 'Choose Photo'}
            </label>
        </div>

        {error && <span className="error-message" style={{ marginTop: '6px', display: 'block' }}>{error}</span>}
    </div>
)
}

window.ImagePicker=ImagePicker;