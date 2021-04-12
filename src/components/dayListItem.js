import React from "react";
import "components/DayListItem.scss"
import classNames from 'classnames'

export default function DayListItem(props) {

  const dayClasses = classNames('day-list__item', { 'day-list__item--selected': props.selected }, { 'day-list__item--full': props.spots === 0 })

  return (
    <li className={dayClasses} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{props.spots}</h3>
    </li>
  );
}