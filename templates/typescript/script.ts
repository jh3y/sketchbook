interface Person {
	name: string
}

const greeter = (person: Person) => `Hello, ${person.name}!` 

let user = { name: 'World' }

document.body.querySelector('h1').innerText = greeter(user)
