import '../../../styles/components/atoms/input/switch.scss';

import React, { MouseEvent, useState } from 'react';

type PropType = {
  handleChange: (_active: boolean, _event: MouseEvent<HTMLButtonElement>) => void;
};

/**
 * Switch component will emit `true` when it is `on`, `false` when it is `off`
 */
export default function Switch({ handleChange }: PropType) {
  const [active, setActive] = useState(false);

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    setActive(!active);
    handleChange(active, e);
  }
  return (
    <div className="my-switch">
      <div className="holder">
        <button
          className={`switch-holder ${active && 'active'} outline-none`}
          onClick={handleClick}>
          <div className={`circle ${active ? 'right' : 'left'}`}></div>
        </button>
      </div>
    </div>
  );
}