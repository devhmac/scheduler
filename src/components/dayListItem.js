import React from "react";
import "components/DayListItem.scss"
import classNames from 'classnames'

export default function DayListItem(props) {

  const dayClasses = classNames('day-list__item', { 'day-list__item--selected': props.selected }, { 'day-list__item--full': props.spots === 0 })

  const formatSpots = (num) => {
    if (!num) return 'no spots remaining'
    if (num === 1) return `1 spot remaining`
    return `${num} spots remaining`
  }

  return (
    <li className={dayClasses} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}