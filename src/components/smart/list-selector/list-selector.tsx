import React, { useEffect, useState } from 'react';

export interface ListItem {
  id: string;
  name: string;
  value: any;
}

type ListSelectorProps = {
  items: ListItem[];
  selectedValue?: any;
  placeholder?: string;
  className?: string;
  onChange?: (value: any) => void;
};

const ListSelector: React.FC<ListSelectorProps> = ({
  items = [],
  selectedValue,
  placeholder = 'Select...',
  className,
  onChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<ListItem>();

  useEffect(() => {
    const foundItem = items.find((item) => item.value === selectedValue);
    foundItem && setSelectedItem(foundItem);

    return () => {};
  }, [selectedValue]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const clickItemHandler = (item: ListItem) => {
    setIsCollapsed(true);
    setSelectedItem(item);
    onChange && onChange(item.value);
  };

  return (
    <div className={`relative overflow-visible bg-gray-100 text-base text-gray-700 ${className}`}>
      <div onClick={toggleCollapse} className="flex cursor-pointer items-center justify-between">
        <div className="px-2 py-1">{selectedItem ? selectedItem.name : placeholder}</div>
        <div className="ml-3 pr-2">
          {isCollapsed ? <i className="bi bi-chevron-down" /> : <i className="bi bi-chevron-up" />}
        </div>
      </div>
      <div
        className={`absolute right-0 top-full z-20 m-0 w-full p-0 drop-shadow transition duration-300 ease-out ${
          isCollapsed
            ? 'pointer-events-none -mt-1 opacity-0'
            : 'pointer-events-auto mt-0 opacity-100'
        }`}
      >
        <ul className="bg-gray-400">
          {items.map((item) => (
            <li
              key={item.id}
              className="cursor-pointer whitespace-nowrap border-t border-dotted border-[#57585b] px-2 py-1 text-gray-600 transition duration-300 ease-out hover:bg-gray-200 hover:text-gray-700"
              onClick={() => clickItemHandler(item)}
            >
              <div className="mr-2 inline-block">{item.name}</div>{' '}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ListSelector;
