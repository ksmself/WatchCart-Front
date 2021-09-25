import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const SortSelect = ({ selected, open }) => {
  const options = [
    { id: 0, name: '전체' },
    { id: 1, name: '별점높은순' },
    { id: 2, name: '별점낮은순' },
  ];

  return (
    <div className="flex flex-col">
      <div className="relative">
        <Listbox.Button className="relative w-36 border-2 border-primary rounded-md shadow-sm pl-3 pr-10 py-2.5 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
          <span className="flex items-center">
            <span className="ml-1 block truncate font-bold">{selected}</span>
          </span>
          <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <SelectorIcon className="h-7 w-7 text-primary" aria-hidden="true" />
          </span>
        </Listbox.Button>

        <Transition
          show={open}
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 w-full bg-gray-800 shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {options.map((option) => (
              <Listbox.Option
                key={option.id}
                className={({ active }) =>
                  classNames(
                    active ? 'text-white bg-primary' : 'text-white',
                    'cursor-default select-none relative py-2 pl-3 pr-9',
                  )
                }
                value={option.name}
              >
                {({ selected, active }) => (
                  <>
                    <div className="flex items-center">
                      <span
                        className={classNames(selected ? 'ml-3 font-semibold' : 'ml-3 font-semibold', 'block truncate')}
                      >
                        {option.name}
                      </span>
                    </div>

                    {selected ? (
                      <span
                        className={classNames(
                          active ? 'text-white' : '',
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </div>
  );
};

export default SortSelect;
