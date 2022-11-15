import "../../../../net/experimental-web-platform/script.js";
import React from 'react'
import { faker } from '@faker-js/faker'
import { createRoot } from 'react-dom/client'

const ROOT = createRoot(document.querySelector('#app'))

function createRandomUser() {
  const sex = faker.name.sexType();
  const firstName = faker.name.firstName(sex);
  const lastName = faker.name.lastName();
  const email = faker.helpers.unique(faker.internet.email, [
    firstName,
    lastName,
  ]);

  return {
    _id: faker.datatype.uuid(),
    avatar: faker.image.avatar(),
    email,
    firstName,
    lastName,
  };
}

const USERS = new Array(10).fill().map(createRandomUser)

const App = () => {
  const selectMenuRef = React.useRef(null)
  const selectedRef = React.useRef(null)

  return (
    <>
      <selectmenu
        ref={selectMenuRef}
        onInput={() => selectedRef.current.innerHTML = selectMenuRef.current.value}
      >
        <div slot="button">
          <button behavior="button">
            <span behavior="selected-value" slot="selected-value" ref={selectedRef}>
            </span>
          </button>
        </div>
        <div slot="listbox">
          <div popover="auto" behavior="listbox">
            <option>Select Recipient</option>
            {USERS.map((USER, index) => (
              <option key={USER._id} value={USER.email}>
                <span>{`${USER.firstName} ${USER.lastName}`}</span>
                <span>{USER.email}</span>
              </option>
            ))}
          </div>
        </div>
      </selectmenu>
    </>
  )
}

ROOT.render(<App/>)