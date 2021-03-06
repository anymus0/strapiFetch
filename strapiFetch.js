// include the following js libraries in the html
// <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.2.6/purify.min.js" integrity="sha512-rXAHWSMciPq2KsOxTvUeYNBb45apbcEXUVSIexVPOBnKfD/xo99uUe5M2OOsC49hGdUrkRLYsATkQQHMzUo/ew==" crossorigin="anonymous"></script>

const apiURL = 'STRAPI_API_URL'

const getBearer = async () => {
  const res = await window.fetch(`${apiURL}/auth/local`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify({
      identifier: 'email',
      password: 'password'
    })
  })
  const data = await res.json()
  return `Bearer ${data.jwt}`
}

const getProduct = async () => {
  // fetch
  const token = await getBearer()
  const res = await window.fetch(`${apiURL}/products`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token
    }
  })

  let dataArr = await res.json()
  dataArr = dataArr.filter(prod => {
    return prod.Active == true
  })

  const data = dataArr[0]

  const prod = {
    title: data.Title,
    liveView: data.liveView,
    qtyLeft: data.qtyLeft,
    descriptions: []
  }
  prod.descriptions.push(data.Description1)
  prod.descriptions.push(data.Description2)
  prod.descriptions.push(data.Description3)
  prod.descriptions.push(data.Description4)
  prod.descriptions.push(data.Description5)

  // convert and sanitize
  prod.descriptions.forEach((desc, index) => {
    const cleanHtml = DOMPurify.sanitize(marked(desc))
    prod.descriptions[index] = cleanHtml
  })
  return prod
}

const setDescription = async () => {
  const product = await getProduct()
  product.descriptions.forEach((desc, index) => {
    document.getElementById(`description${index+1}`).innerHTML = desc
  })
  document.getElementById('description2Mobile').innerHTML = product.descriptions[1]
  document.getElementById('description4Mobile').innerHTML = product.descriptions[3]
}

setDescription()
