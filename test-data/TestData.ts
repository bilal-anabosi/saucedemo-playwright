export const TestData = {
  users: {
    standard: {
      username: process.env.STANDARD_USER || 'standard_user',
      password: process.env.PASSWORD || 'secret_sauce'
    },
    lockedOut: {
      username: process.env.LOCKED_OUT_USER || 'locked_out_user',
      password: process.env.PASSWORD || 'secret_sauce'
    },
  },
  
  invalidCredentials: [
    { username: '', password: '', expectedError: 'Username is required' },
    { username: 'standard_user', password: '', expectedError: 'Password is required' },
    { username: '', password: 'secret_sauce', expectedError: 'Username is required' },
    { username: 'invalid_user', password: 'invalid_password', expectedError: 'Username and password do not match' }
  ],

  sortOptions: {
    nameAZ: 'az',
    nameZA: 'za',
    priceLowHigh: 'lohi',
    priceHighLow: 'hilo'
  },

  products: {
    backpack: 'Sauce Labs Backpack',
    bikeLight: 'Sauce Labs Bike Light',
    boltTShirt: 'Sauce Labs Bolt T-Shirt',
    fleeceJacket: 'Sauce Labs Fleece Jacket',
    onesie: 'Sauce Labs Onesie',
    redTShirt: 'Test.allTheThings() T-Shirt (Red)'
  },

  checkoutInfo: {
    valid: {
      firstName: 'John',
      lastName: 'Doe',
      postalCode: '12345'
    },
    invalid: [
      { firstName: '', lastName: 'Doe', postalCode: '12345', expectedError: 'First Name is required' },
      { firstName: 'John', lastName: '', postalCode: '12345', expectedError: 'Last Name is required' },
      { firstName: 'John', lastName: 'Doe', postalCode: '', expectedError: 'Postal Code is required' }
    ]
  }
};