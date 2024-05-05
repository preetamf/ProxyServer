import React from 'react';

const Header = () => {
  return (
    <header>
      <div className="mx-auto max-w-screen-xl px-2 py-2 sm:px-2 sm:py-2 lg:px-2">
        <div className="sm:flex sm:items-center sm:justify-between p-1">
          <div className="text-center sm:text-left">
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Welcome Back, User!</h1>
            <p className="mt-1.5 text-sm text-gray-500">Let's explore with no restrictions! </p>
          </div>

          <div className="mt-2 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
          <a href="#" className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
                    <img
                        alt=""
                        src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                        className="size-10 rounded-full object-cover"
                    />

                    <div>
                        <p className="text-xs">
                            <strong className="block font-medium">User</strong>

                            <span> user@gmail.com </span>
                        </p>
                    </div>
                </a>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
