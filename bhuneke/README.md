#Express Resources with Mongoose

An API to manage tree resources with Mongoose

## Getting Started

1. Install [Node.js](https://nodejs.org/en/)
2. Run `npm install`

Run `npm run start` to start server. Default port number is `3000`. So, the base url should be `http://localhost:3000/`.

## API

### List all tree

Get a list of all trees in the collection.

```
GET /trees
```

### Get one tree

Get a specific tree from the collection by id.

```
GET /trees/:id
```

### Add tree resource

Data coming in will create tree object in the database.

```
POST /trees/
```

### Update tree resource

Data coming in will replace existing tree object in its entirety.

```
PUT /trees/:id
```

### Remove tree resource

The tree instance will be deleted from the database.

```
DELETE /trees/:id
```

## TREE INSTANCE REQUIREMENTS

### Required Fields
    - name: <String>,
    - genus: <one of the following strings: ['Quercus', 'Acer', 'Pinus', 'Catalpa', 'Ulmus']>

### Optional Fields
    - species: String,
    - deciduous: Boolean,
    - hieght: Number between 20 and 80