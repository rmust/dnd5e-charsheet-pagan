import { useEffect, useState } from "react";
import classNames from "classnames";

import { Loader } from "../common/loader";
import { differenceBy } from "lodash";

export const SpellsSearch = () => {
  const [state, setState] = useState({
    fetchedSpells: null,
    searchQuery: "",
    foundSpells: null,
    mySpells: [],
    isLoading: true,
  });

  useEffect(() => {
    fetch("https://www.dnd5eapi.co/api/spells")
      .then((res) => res.json())
      .then((data) => {
        const fetchedSpells = differenceBy(
          data.results,
          state.mySpells,
          "index"
        );
        return setState({ ...state, fetchedSpells, isLoading: false });
      });
  }, []);

  const getSearchResults = (keyword) => {
    if (!keyword)
      return setState({ ...state, foundSpells: null, searchQuery: "" });

    // implement worker and move there smart logic
    const foundSpells = state.fetchedSpells
      .filter((spell) => spell.index.includes(keyword))
      .slice(0, 5);

    return setState({ ...state, foundSpells, searchQuery: keyword });
  };

  const fetchSpellDetails = async (spell) =>
    fetch(`https://www.dnd5eapi.co${spell.url}`)
      .then((res) => res.json())
      .then((data) => data);

  const handleAddSpell = async (spell) => {
    const fetchedSpells = state.fetchedSpells.filter(
      (s) => s.index !== spell.index
    );

    const spellDetails = await fetchSpellDetails(spell);

    return setState({
      ...state,
      fetchedSpells,
      mySpells: [
        ...state.mySpells,
        { ...spell, spellDetails, isRendered: false },
      ],
      searchQuery: "",
      foundSpells: null,
    });
  };

  const renderSearchResults = () => (
    <div className="search-results">
      {state.foundSpells.map((spell) => (
        <button
          className="add-spell-btn"
          key={`${spell.index}-search`}
          onClick={() => handleAddSpell(spell)}
        >
          {spell.name}
        </button>
      ))}
    </div>
  );

  const renderSpellDetails = (spell) => (
    <div className="spell-details">
      <div className="spell-details-group">
        <span>
          <strong>{spell.spellDetails.school.name}</strong>
        </span>
      </div>
      <div className="spell-details-group">
        <span>
          Level:{" "}
          <strong>
            {spell.spellDetails.level === 0
              ? "Cantrip"
              : spell.spellDetails.level}
          </strong>
        </span>
        <span>
          Casting time: <strong>{spell.spellDetails.casting_time}</strong>
        </span>
        <span>
          Range: <strong>{spell.spellDetails.range}</strong>
        </span>
        <span>
          Components:{" "}
          <strong>{spell.spellDetails.components.join(", ")}</strong>
        </span>
        <span>
          Duration: <strong>{spell.spellDetails.duration}</strong>
        </span>
      </div>
      <div className="spell-details-group">
        {spell.spellDetails.desc.map((d) => (
          <p key={d}>{d}</p>
        ))}
      </div>
    </div>
  );

  const handleSpellDelete = (spell) => {
    const mySpells = state.mySpells.filter((s) => s.index !== spell.index);
    return setState({
      ...state,
      mySpells,
      fetchedSpells: [...state.fetchedSpells, spell],
    });
  };

  const toggleSpellDetails = (spell) => {
    const mySpells = state.mySpells;
    const index = mySpells.indexOf(spell);

    mySpells[index].isRendered = !mySpells[index].isRendered;

    return setState({ ...state, mySpells });
  };

  const renderMySpells = () => (
    <div className="my-spells">
      {state.mySpells &&
        state.mySpells.map((spell) => (
          <div key={`${spell.index}-my-spells`} className="my-spell">
            <div
              className={classNames("spell-btn", "justify-text", {
                "active-spell-btn": spell.isRendered,
              })}
            >
              <button
                className="btn spell-name-btn"
                style={{ textAlign: "left" }}
                onClick={() => toggleSpellDetails(spell)}
              >
                <strong>{spell.spellDetails.level}</strong> {spell.name}
                <div></div>
              </button>
              <button
                className="btn btn-outline-danger border-0 rounded-circle btn-sm square-btn"
                onClick={() => handleSpellDelete(spell)}
              >
                -
              </button>
            </div>
            {spell.isRendered ? renderSpellDetails(spell) : null}
          </div>
        ))}
    </div>
  );

  if (state.isLoading) return <Loader />;

  return (
    <div className="spells">
      <div className="input-group">
        <input
          className="form-control"
          type="text"
          placeholder="search for the spell"
          value={state.searchQuery}
          onChange={(e) => getSearchResults(e.target.value)}
        />
        <div class="input-group-append">
          <button
            className="btn btn-outline-secondary dropdown-toggle"
            type="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            name
          </button>
          <div className="dropdown-menu">
          </div>
        </div>
      </div>
      <p>TODO: filter by level, class, etc...</p>
      {state.foundSpells ? renderSearchResults() : null}
      {state.mySpells ? renderMySpells() : null}
    </div>
  );
};
