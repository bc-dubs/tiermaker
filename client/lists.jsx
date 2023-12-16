/*
    Code for the actual application content (after user has logged in)
*/

const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const grades = ['S', 'A', 'B', 'C', 'D', 'E', 'F']

const newEntry = (e) => {
    e.preventDefault();
    helper.hideError();


}

const newTier = (e) => {
    e.preventDefault();
    helper.hideError();


}

const newTierlist = (e) => {
    e.preventDefault();
    helper.hideError();

    const numTiers = e.target.getElementById('#numTiers').value;

    if(!(numTiers || numTiers === 0)) {
        helper.handleError('Must specify # of tiers!');
        return false;
    }
    
    for(let i = 0; i < numTiers; i++){
        helper.sendPost('tiers', {grade: grades[i], index: i});
    }

    populateTierlist();
}

const NewTierlistForm = (props) => {
    return (
        <form id="newListForm"
            name="newListForm"
            onSubmit={newTierlist}
            action="/login"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="numTiers">Number of Tiers: </label>
            <input id="numTiers" type="number" name="numTiers" min="0" />
            <input className = "formSubmit" type="submit" value="Create new tierlist" />
        </form>
    );
};

const Tierlist = (props) => {
    const tierNodes = props.tiers.map(t => Tier(t.tier, t.entries));
    return(
        <ol id="tierlist">
            {tierNodes}
        </ol>
    );
}

const Tier = (tier, entries) => {
    const entryNodes = entries.map(Entry);
    return(
        <li id={tier.grade}
            className='tier'
            style={{backgroundColor: tier.color}}
        >
            <h2>{tier.grade}</h2>
            <p>{tier.text}</p>
            <ol>
                {entryNodes}
            </ol>
        </li>
    );
}

const Entry = (entry) => {
    return(
        <li id={entry.name}
            name={entry.name}
            className="entry"
        >
            <h3 className='entryName'>{entry.name}</h3>
        </li>
    );
}

const populateTierlist = async () => {
    const tierlistResponse = await fetch('/tierlist');
    const tierlistData = await tierlistResponse.json();
    ReactDOM.render(
        <Tierlist tiers={tierlistData} />,
        document.getElementById('tiers')
    );
}

const init = () => {
    ReactDOM.render(
        <NewTierlistForm />,
        document.getElementById('tiers')
    );
}

window.onload = init;