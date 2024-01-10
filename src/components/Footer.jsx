import React from 'react'

export default function Footer() {
  return (
    <footer class="bg-black text-white w-full relative bottom-0">
        <div class="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
          <div class="md:flex md:justify-between">
            <div class="mb-6 md:mb-0">
              <a href="/" class="flex items-center">
                <span class="self-center text-2xl font-semibold whitespace-nowrap">
                  Jesus Shirts
                </span>
              </a>
            </div>
            <div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
              <div>
                <h2 class="mb-6 text-sm font-semibold text-white uppercase dark:text-white">
                  Resources
                </h2>
                <ul class="text-gray-400 dark:text-gray-400 font-medium">
                  <li class="mb-4">
                    <a href="/" class="hover:underline">
                      Jesus Shirts
                    </a>
                  </li>
                  <li>
                    <a href="https://tailwindcss.com/" class="hover:underline">
                      Tailwind CSS
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 class="mb-6 text-sm font-semibold text-white uppercase dark:text-white">
                  Follow us
                </h2>
                <ul class="text-gray-400 dark:text-gray-400 font-medium">
                  <li class="mb-4">
                    <a href="/" class="hover:underline ">
                      Github
                    </a>
                  </li>
                  <li>
                    <a href="/" class="hover:underline">
                      Discord
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 class="mb-6 text-sm font-semibold text-white uppercase dark:text-white">
                  Legal
                </h2>
                <ul class="text-gray-400 dark:text-gray-400 font-medium">
                  <li class="mb-4">
                    <a href="#" class="hover:underline">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" class="hover:underline">
                      Terms &amp; Conditions
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <hr class="my-6 border-gray-200 sm:mx-auto" />
          <div class="sm:flex sm:items-center sm:justify-between">
            <span class="text-sm">
              © 2023{" "}
              <a href="/" class="hover:underline">
                Jesus-Shirts™
              </a>
              . All Rights Reserved.
            </span>
            <div class="flex mt-4 sm:justify-center sm:mt-0">
              <a href="#" class="text-white hover:text-gray-900">
                <svg
                  class="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 8 19"
                >
                  <path
                    fill-rule="evenodd"
                    d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="sr-only">Facebook page</span>
                <span class="sr-only">Facebook page</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
  )
}
