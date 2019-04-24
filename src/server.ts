import app from './app'

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`server now listening for requests on port ${port}`)
})
