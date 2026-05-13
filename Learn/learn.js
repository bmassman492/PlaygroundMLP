const popupContent = {
    1: { title: 'Topic 1', body: 'Placeholder content for button 1.' },
    2: { title: 'Topic 2', body: 'Placeholder content for button 2.' },
    3: { title: 'Topic 3', body: 'Placeholder content for button 3.' },
    4: { title: 'Topic 4', body: 'Placeholder content for button 4.' },
    5: { title: 'Topic 5', body: 'Placeholder content for button 5.' },
    6: { title: 'Topic 6', body: 'Placeholder content for button 6.' },
    7: { title: 'Topic 7', body: 'Placeholder content for button 7.' },
    8: { title: 'Topic 8', body: 'Placeholder content for button 8.' },
};

function openPopup(id) {
    const content = popupContent[id];
    document.getElementById('popup-title').textContent = content.title;
    document.getElementById('popup-body').textContent = content.body;
    document.getElementById('popup-overlay').style.display = 'flex';
}

function closePopup() {
    document.getElementById('popup-overlay').style.display = 'none';
}
