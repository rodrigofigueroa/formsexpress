const express     = require( 'express' ),
      app         = express(),
      { engine }  = require( 'express-handlebars' ),
      port        = process.env.PORT || 1024

app.use( express.urlencoded({ extended: false }))
app.use( express.json() )

app.engine( 'handlebars', engine({
  defaultLayout: 'main'
}))

app.set( 'view engine', 'handlebars' )

app.get( '/', ( req, res ) => res.render( 'home' ))
app.get( '/form', ( req, res ) => res.render( 'form' ))
app.get( '/thank-you', ( req, res ) => res.render( 'thank-you' ))

// GET data
const USERS = [
  { id: 0, userName: 'Finn', userAge: 12, userGoal: 'Hero' },
  { id: 1, userName: 'Jake', userAge: 28, userGoal: 'Father' },
  { id: 2, userName: 'BMO', userAge: 100, userGoal: 'Human' }
]

app.get( '/api/get/allusers/', ( req, res ) => res.json( USERS ))

// POST 
app.post( '/api/post/common/', ( req, res ) => {
  console.log( req.body )
  res.redirect( 303, '/thank-you' )
})

app.post( '/api/post/fetch/user/', ( req, res ) => {
  try{
    const newUser = req.body
    const find    = USERS.find( i => newUser.userName === i.userName ? i : '')
    console.log( find )
    if( find ){
      res.status( 404 ).json({
        success: false,
        error: 'We cant upload because it is already exists in our DB'
      })
    }else{
      for(let i = 0; i < ( USERS.length + 1 ); i++ ){
        if( USERS[ i ] === undefined ){
          USERS.push( Object.assign( { id: i }, newUser ) )
          break;
        }
      }
      console.log( USERS )
      res.json({
        success: true
      })
    }
  }catch( err ){
    console.log( err )
    res.status( 500 ).json({
      success: false,
      error: 'We cant upload the user'
    })
  }
})

app.put( '/api/put/user/:id', ( req, res ) => {
  const uptUser = req.body
  const found = USERS.find( itm => itm.id === parseInt( req.params.id ) ? itm : '')
  console.log( uptUser, req.params )
  if( found !== undefined ){
    if( uptUser.userName ){
      found.userName = uptUser.userName
    }
    if( uptUser.userAge ){
      found.userAge = uptUser.userAge
    }
    if( uptUser.userGoal ){
      found.userGoal = uptUser.userGoal
    }
    res.json({
      success: true
    })
  }else{
    res.status( 404 ).json({
      success: false,
      error: 'We cant update the user'
    })
  }
})

// DELETE

app.delete( '/api/delete/user/:id', ( req, res ) => {
  const found = USERS.findIndex( i => parseInt( req.params.id ) === i.id ? i : '')
  console.log( found )
  if( found >= 0 ){
    USERS.splice( found, 1 )
    res.json({
      success: true
    })
  }else{
    res.status( 404 ).json({
      success:false,
      error: 'We cant delete the user'
    })
  }
})
// Error and 404
app.use( ( req, res ) => res.status( 404 ).render( '404' ))
app.use( ( err, req, res, next ) => res.status( 500 ).render( '500' ))

app.listen( port, console.log( `http://127.0.0.1:${ port }` ))