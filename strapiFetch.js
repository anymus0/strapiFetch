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
  const res = await window.fetch(`${apiURL}/products/1`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token
    }
  })
  const data = await res.json()
  const prod = {
    title: data.Title,
    liveView: data.liveView,
    qtyLeft: data.qtyLeft,
    descriptions: []
  }
  prod.descriptions.push(data.Description1)

  // convert and sanitize
  prod.descriptions.forEach((desc, index) => {
    const cleanHtml = DOMPurify.sanitize(marked(desc))
    prod.descriptions[index] = cleanHtml
  })
  return prod
}

const setDescription = async () => {
  const product = await getProduct()
  const desc1 = document.getElementById('description1')
  desc1.innerHTML = product.descriptions[0]
}

setDescription()
