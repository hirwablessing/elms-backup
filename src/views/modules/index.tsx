import React, { useState } from 'react';

import Button from '../../components/Atoms/custom/Button';
import Heading from '../../components/Atoms/Text/Heading';
import Cacumber from '../../components/Molecules/Cacumber';
import CourseCardMolecule from '../../components/Molecules/cards/CourseCardMolecule';
import Dashboard from '../../components/Molecules/Dashboard';
import SearchMolecule from '../../components/Molecules/input/SearchMolecule';
import PopupMolecule from '../../components/Molecules/Popup';
import { CourseModelDataType, Link } from '../../types';

export default function Modules() {
  const [open, setOpen] = useState(false); // state to controll the popup
  const closeModel = () => setOpen(false); // when this is fired the popup will be closed
  const openModel = () => setOpen(true); // when this is fired the popup will be oponed

  const list: Link[] = [
    { to: 'home', title: 'home' },
    { to: 'modules', title: 'modules' },
    { to: 'subjects', title: 'subjects' },
  ];

  const data: CourseModelDataType[] = [
    {
      status: { type: 'success', text: 'On going' },
      code: 'HR450-TC',
      title: 'Here we go',
      subTitle: 'ON Air',
      description:
        'We have all kind of courses in this card, we can support everything wabyanga wabyemera',
    },
    {
      status: { type: 'success', text: 'On going' },
      code: 'HR450-TC',
      title: 'Here we go',
      subTitle: 'ON Air',
      description:
        'We have all kind of courses in this card, we can support everything wabyanga wabyemera',
    },
    {
      status: { type: 'warning', text: 'On Hold' },
      code: 'HR450-TC',
      title: 'Here we go',
      subTitle: 'ON Air',
      description:
        'We have all kind of courses in this card, we can support everything wabyanga wabyemera',
    },
    {
      status: { type: 'error', text: 'Completed' },
      code: 'HR450-TC',
      title: 'Here we go',
      subTitle: 'ON Air',
      description:
        'We have all kind of courses in this card, we can support everything wabyanga wabyemera',
    },
  ];

  return (
    <Dashboard>
      <main className="px-4">
        <section>
          <Cacumber list={list}></Cacumber>
        </section>
        <section className="flex justify-between items-center">
          <Heading fontSize="2xl" fontWeight="bold">
            Modules
          </Heading>
          <SearchMolecule></SearchMolecule>
          <Button onClick={openModel}>Add Module</Button>
        </section>
        <section className="flex flex-wrap justify-between mt-2">
          {data.map((course) => (
            <div key={course.code} className="p-1 mt-3">
              <CourseCardMolecule
                data={course}
                to={{ title: 'module', to: 'modules/id' }}
              />
            </div>
          ))}
        </section>

        {/* add module popup */}
        <PopupMolecule title="New Module" open={open} onClose={closeModel}>
          <div className="w-60">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae magni omnis
            delectus nemo, maxime molestiae dolorem numquam mollitia, voluptate ea,
            accusamus excepturi deleniti ratione sapiente! Laudantium, aperiam doloribus.
            Odit, aut.
          </div>
        </PopupMolecule>
      </main>
    </Dashboard>
  );
}