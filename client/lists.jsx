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

const addTier = (e) => {
    e.preventDefault();
    helper.hideError();

    const numTiers = document.querySelectorAll('.tier').length;
    helper.sendPost('tiers', {grade: grades[numTiers], index: numTiers}, populateTierlist);
}

const subtractTier = (e) => {
    e.preventDefault();
    helper.hideError();

    helper.sendDelete('tiers', {}, populateTierlist);
}

const newTierlist = (e) => {
    e.preventDefault();
    helper.hideError();

    const numTiers = e.target.querySelector('#numTiers').value;

    if(!(numTiers || numTiers === 0)) {
        helper.handleError('Must specify # of tiers!');
        return false;
    }
    
    for(let i = 0; i < numTiers; i++){
        helper.sendPost('tiers', {grade: grades[i], index: i});
    }

    helper.sendPost('tiers', {grade: "Pool", index: -1});

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
            <input id="numTiers" type="number" name="numTiers" min="0" max="7"/>
            <input className = "formSubmit" type="submit" value="Create new tierlist" />
        </form>
    );
};

const Tierlist = (props) => {
    console.log(props.tiers);
    const tierNodes = props.tiers.map(t => Tier(t.tier, t.entries));
    return(
        <div id="tierlist">
            <ol >
                {tierNodes}
            </ol>
            <button id="subtractTierBtn" onClick={subtractTier} style={{visibility: props.tiers.length < 2? "hidden":"visible"}}>-</button>
            <button id="addTierBtn" onClick={addTier} style={{visibility: props.tiers.length > 6? "hidden":"visible"}}>+</button>
        </div>
    );
}

const Tier = (tier, entries) => {
    console.log(entries);
    const entryNodes = entries? entries.map(Entry) : "";
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

const Pool = (props) => {
    console.log(props);
    const entryNodes = props.entries.map(Entry);
    return(
        <div>
            <ol >
                {entryNodes}
            </ol>
            <button id="addEntryBtn" onClick={newEntry} style={{visibility: props.entries.length > 20? "hidden":"visible"}}>New Entry</button>
        </div>
    );
}

const populateTierlist = async () => {
    const tierlistResponse = await fetch('/tierlist');
    const tierlistData = await tierlistResponse.json();
    console.log(tierlistData);
    if(tierlistData.tiers.length < 1) return false;
    ReactDOM.render(
        <Tierlist tiers={tierlistData.tiers} />,
        document.getElementById('tiers')
    ); 

    const poolResponse = await fetch('/pool');
    const poolData = await poolResponse.json();
    // helper.sendPost('/findEntries', {tier_id: poolData.pool._id}, (result) => {
    //     console.log(result);
    //     ReactDOM.render(
    //         <Pool entries={result.entries} />,
    //         document.getElementById('pool')
    //     );
    // });
    const allEntries = await fetch('/entries');
    const allEntriesData = await allEntries.json();
    console.log(allEntriesData);
    const poolEntries = allEntriesData.entries.filter((e) => e._id === poolData.pool._id);
    ReactDOM.render(
        <Pool entries={poolEntries} />,
        document.getElementById('pool')
    );
    return true;
}

const init = async() => {
    if(!(await populateTierlist())){
        ReactDOM.render(
            <NewTierlistForm />,
            document.getElementById('tiers')
        );
    }
}

window.onload = init;