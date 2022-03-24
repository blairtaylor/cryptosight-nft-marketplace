import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Row, Col, Card, Button, Nav } from 'react-bootstrap'
import { Input } from 'antd'
const { Search } = Input

const Home = ({ marketplace, nft }) => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const loadMarketplaceItems = async () => {
    // Load all unsold items
    const itemCount = await marketplace.itemCount()
    let items = []
    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.items(i)
      if (!item.sold) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(item.tokenId)
        // use uri to fetch the nft metadata stored on ipfs
        const response = await fetch(uri)
        const metadata = await response.json()
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(item.itemId)
        // Add item to items array
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          timestamp: metadata.timestamp,
        })
      }
    }
    setLoading(false)
    setItems(items)
  }

  const buyMarketItem = async (item) => {
    await (
      await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })
    ).wait()
    loadMarketplaceItems()
  }

  useEffect(() => {
    loadMarketplaceItems()
  }, [])
  if (loading)
    return (
      <main style={{ padding: '1rem 0' }}>
        <h2 className="h2-text">Loading...</h2>
      </main>
    )
  return (
    <div className="flex justify-center">
      {items.length > 0 ? (
        <div className="px-5 container">
          <Row>
            <Col>
              <h2 className="h2-text">Items Listed for Sale</h2>
            </Col>
            <Col>
              <div className="float-end">
                <Search
                  style={{ width: 400 }}
                  placeholder="enter item name"
                  enterButton="Search"
                />
              </div>
            </Col>
          </Row>

          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {items.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card style={{ width: '14rem' }}>
                  <Card.Header>
                    {new Intl.DateTimeFormat('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    }).format(item.timestamp)}
                  </Card.Header>
                  <Card.Img variant="top" src={item.image} alt={item.name} />
                  {/* <Card.ImgOverlay variant="primary">
                    <Card.Title size="sm" variant="primary">Image Only</Card.Title>
                  </Card.ImgOverlay> */}
                  <Card.Body color="secondary">
                    <Card.Title size="sm">{item.name}</Card.Title>
                    <Card.Text size="sm">{item.description}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <div className="d-grid">
                      <Button
                        className="custom-btn"
                        onClick={() => buyMarketItem(item)}
                        variant="primary"
                        size="sm"
                      >
                        Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <main style={{ padding: '1rem 0' }}>
          <h2 className="h2-text">
            There are no NFT assets assigned to your account.
          </h2>
        </main>
      )}
    </div>
  )
}
export default Home
