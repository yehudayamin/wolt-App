/*
 * CategoryBar.jsx - Horizontal Category Filter Bar (Task 6.1)
 *
*/


function CategoryBar() {
    //hooks
    const history = ReactRouterDOM.useHistory()
    const scrollRef = React.useRef(null)


    const CATEGORIES = [
        { name: 'Burgers',      emoji: '🍔' },
        { name: 'Pizza',        emoji: '🍕' },
        { name: 'Italian',      emoji: '🍝' },
        { name: 'Falafel',      emoji: '🧆' },
        { name: 'Hummus',       emoji: '🫘' },
        { name: 'Vegan',        emoji: '🥗' },
        { name: 'Vegetarian',   emoji: '🥦' },
        { name: 'Cafes',        emoji: '☕' },
        { name: 'Sushi',        emoji: '🍣' },
        { name: 'Chinese',      emoji: '🥡' },
        { name: 'Home Food',    emoji: '🍲' },
        { name: 'Kosher',       emoji: '✡️' },
        { name: 'Noodles',      emoji: '🍜' },
    ]

    function scrollLeft() { //when you press on the left arrow of the bar
        scrollRef.current.scrollLeft -= 200;
    }
    function scrollRight(){ //when you press on the right arrow of the bar
        scrollRef.current.scrollLeft += 200;
    }
    
    const scrollBtnStyle = {
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        border: '1px solid rgba(0, 157, 224, 0.35)',
        background: 'rgba(0, 157, 224, 0.1)',
        boxShadow: '0 2px 8px rgba(0, 157, 224, 0.15)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        fontWeight: '600',
        color: '#009de0',
        flexShrink: 0,
        transition: 'background 0.2s ease, box-shadow 0.2s ease',
    };

    return <div className="category-bar-wrapper">
        <button onClick={scrollLeft} style={scrollBtnStyle}>‹</button>
        <div className="category-bar" ref={scrollRef}>
        {CATEGORIES.map(cat => (
        <div className="category-item" onClick={() => history.push(`/category/${cat.name}`)}>
            <div className="category-circle">{cat.emoji}</div>
            <span className="category-name">{cat.name}</span>
            </div>
        ))}
        </div>
        <button onClick={scrollRight} style={scrollBtnStyle}>›</button>
        </div>
 
}

window.CategoryBar = CategoryBar;