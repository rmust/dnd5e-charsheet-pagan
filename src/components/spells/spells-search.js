import { useEffect, useState } from "react";

import Button from "react-bootstrap/Button";

export function SpellsSearch() {
  const [fetchedSpells, setFetchedSpells] = useState();
  useEffect(() => {
    fetch("https://www.dnd5eapi.co/api/spells")
      .then((res) => res.json())
      .then((data) => setFetchedSpells(data.results));
  }, []);

  const [searchedSpell, setSearchedSpell] = useState();

  const [mySpells, setMySpells] = useState([]);

  const addSpell = (spell) => {
    setSearchedSpell("");
    return setMySpells([...mySpells, spell]);
  };

  const renderSearchResults = (maxCount) => (
    <div className="d-flex flex-column">
      {fetchedSpells && searchedSpell
        ? fetchedSpells
            .filter(
              (spell) =>
                spell.name.toLowerCase().includes(searchedSpell) &&
                !mySpells.includes(spell)
            )
            .slice(0, maxCount)
            .map((spell) => (
              <Button
                variant="outline-secondary border-0"
                key={`${spell.index}-search`}
                onClick={() => addSpell(spell)}
              >
                {spell.name}
              </Button>
            ))
        : null}
    </div>
  );

  const [mySpellDetails, setMySpellDetails] = useState();

  const fetchMySpellDetails = async (spell) =>
    fetch(`https://www.dnd5eapi.co${spell.url}`)
      .then((res) => res.json())
      .then((data) => setMySpellDetails(data));

  const renderMySpells = (mySpells, mySpellDetails) => (
    <div className="my-spells d-flex flex-column">
      {mySpells.length > 0 &&
        mySpells.map((spell) => (
          <div>
            <Button
              variant="outline-secondary border-0"
              key={`${spell.index}-my-spell`}
              onClick={() => fetchMySpellDetails(spell)}
            >
              {spell.name}
            </Button>
            {mySpellDetails && mySpellDetails.index === spell.index && (
              <div>
                <p>{mySpellDetails.school.name}</p>
                <p>
                  Level:{" "}
                  <strong>
                    {mySpellDetails.level === 0
                      ? "Cantrip"
                      : mySpellDetails.level}
                  </strong>
                </p>
                <p>
                  Casting time: <strong>{mySpellDetails.casting_time}</strong>
                </p>
                <p>
                  Range: <strong>{mySpellDetails.range}</strong>
                </p>
                <p>
                  Components:{" "}
                  <strong>{mySpellDetails.components.join(", ")}</strong>
                </p>
                <p>
                  Duration: <strong>{mySpellDetails.duration}</strong>
                </p>
                {mySpellDetails.desc.map((desc) => (
                  <p>{desc}</p>
                ))}
              </div>
            )}
          </div>
        ))}
    </div>
  );

  return (
    <div className="spells">
      {renderMySpells(mySpells, mySpellDetails)}
      <input
        type="text"
        className="form-control"
        placeholder="search for the spell"
        value={searchedSpell}
        onChange={(e) => setSearchedSpell(e.target.value)}
      />
      {renderSearchResults(5)}
    </div>
  );
}
