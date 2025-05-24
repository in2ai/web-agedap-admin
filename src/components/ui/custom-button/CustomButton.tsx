import * as React from 'react';

type CustomButtonProps = {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  buttonType?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  hasLargeFont?: boolean;
  tabIndex?: number;
  bootstrapIconClass?: string;
  disabled?: boolean;
  onClick?: () => void;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  type = 'button',
  buttonType = 'primary',
  size = 'medium',
  hasLargeFont = false,
  tabIndex,
  bootstrapIconClass,
  disabled = false,
  onClick,
}) => {
  return (
    <button
      tabIndex={tabIndex}
      type={type}
      onClick={onClick}
      className={`flex w-full cursor-pointer flex-row items-center  ${bootstrapIconClass ? 'justify-start px-3' : 'justify-center'} rounded-md ${
        size === 'small' ? 'h-[55px]' : size === 'medium' ? 'h-[60px]' : 'h-[65px]'
      } ${
        disabled
          ? 'bg-[#3c7c8c] opacity-50'
          : buttonType === 'primary'
            ? 'border border-white bg-[#3c7c8c] opacity-100'
            : buttonType === 'secondary'
              ? 'border border-black bg-white opacity-100'
              : 'border border-red-500 bg-red-500 opacity-100'
      }`}
    >
      {bootstrapIconClass && <i className={`${bootstrapIconClass} mr-2`} />}
      <p
        className={`whitespace-nowrap ${
          hasLargeFont ? 'text-[25px]' : 'text-[19px]'
        } font-semibold ${
          disabled
            ? 'text-[#3c7c8c]'
            : buttonType === 'primary' || buttonType === 'danger'
              ? 'text-white'
              : 'text-[#3c7c8c]'
        }`}
      >
        {children}
      </p>
    </button>
  );
};

export default CustomButton;
