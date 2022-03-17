import { useState, useRef } from 'react'
import { ethers } from 'ethers'
import { Row, Form, Button, Card, FormLabel } from 'react-bootstrap'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useScreenshot } from 'use-screenshot-hook'

import ticket1 from '../images/simple-party-ticket-1.png'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const AddItem = ({ marketplace, nft }) => {
  const [image, setImage] = useState('')
  const [price, setPrice] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const imageRef = useRef(null)
  const { ticketImage, takeScreenshot } = useScreenshot()
  const [template, setTemplate] = useState('upload')
  const uploadToIPFS = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    if (typeof file !== 'undefined') {
      try {
        const result = await client.add(file)
        console.log(result)
        setImage(`https://ipfs.infura.io/ipfs/${result.path}`)
      } catch (error) {
        console.log('ipfs image upload error: ', error)
      }
    }
  }
  const createNFT = async () => {
    if (!image || !price || !name || !description) return
    try {
      const timestamp = Date.now()
      const result = await client.add(
        JSON.stringify({ image, price, name, description, timestamp }),
      )
      mintThenList(result)
    } catch (error) {
      console.log('ipfs uri upload error: ', error)
    }
  }
  const mintThenList = async (result) => {
    const uri = `https://ipfs.infura.io/ipfs/${result.path}`
    // mint nft
    await (await nft.mint(uri)).wait()
    // get tokenId of new nft
    const id = await nft.tokenCount()
    // approve marketplace to spend nft
    await (await nft.setApprovalForAll(marketplace.address, true)).wait()
    // add nft to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString())
    await (await marketplace.makeItem(nft.address, id, listingPrice)).wait()
  }

  const handleChange = (e) => {
    e.persist()
    console.log(e.target.value)
    setTemplate(e.target.value)
  }

  function displayUpload() {
    if (template === 'upload') {
      return (
        <Form.Control
          type="file"
          required
          name="file"
          onChange={uploadToIPFS}
        />
      )
    }
  }
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main
          role="main"
          className="col-lg-12 mx-auto"
          style={{ maxWidth: '1000px' }}
        >
          <div className="content mx-auto">
            <Row className="g-4">
              <div className="mb-3" style={{ textAlign: 'left' }}>
                <Form.Group controlId="selectNFT">
                  <Form.Check
                    inline
                    type="radio"
                    value="upload"
                    onChange={handleChange}
                    checked={template === 'upload'}
                    id="rb-template-1"
                    label="Upload an Image"
                  />
                  <Form.Check
                    inline
                    type="radio"
                    value="template"
                    onChange={handleChange}
                    checked={template === 'template'}
                    id="rb-template-2"
                    label="Choose a template"
                  />
                </Form.Group>
              </div>
              { displayUpload() }
              <Form.Control
                onChange={(e) => setName(e.target.value)}
                size="lg"
                required
                type="text"
                placeholder="Name"
              />
              <Form.Control
                onChange={(e) => setDescription(e.target.value)}
                size="lg"
                required
                as="textarea"
                placeholder="Description"
              />
              <Form.Control
                onChange={(e) => setName(e.target.value)}
                size="lg"
                required
                type="text"
                placeholder="Date"
              />
              <Form.Control
                onChange={(e) => setName(e.target.value)}
                size="lg"
                required
                type="text"
                placeholder="Time"
              />
              <Form.Control
                onChange={(e) => setAddress(e.target.value)}
                size="lg"
                required
                type="text"
                placeholder="Address"
              />
              <Form.Control
                onChange={(e) => setPrice(e.target.value)}
                size="lg"
                required
                type="number"
                placeholder="Price in ETH"
              />
            </Row>
            <Row className="g-4">
              <div ref={imageRef}>
                <Card
                  style={{ width: '50rem', paddingTop: 20, paddingBottom: 20 }}
                >
                  <Card.Img variant="bottom" src={ticket1} />
                  <Card.ImgOverlay
                    style={{
                      paddingTop: 40,
                      paddingLeft: 540,
                      fontFamily: 'Arial, Helvetica, sans-serif',
                      fontWeight: 'bold',
                    }}
                  >
                    <Card.Text>March 15, 2020</Card.Text>
                    <Card.Text>8pm</Card.Text>
                    <Card.Text>{address}</Card.Text>
                    <Card.Text>{price} ETH</Card.Text>
                  </Card.ImgOverlay>
                </Card>
              </div>
            </Row>
            <Row className="g-4">
              &nbsp;
              <div className="d-grid px-0">
                <Button
                  onClick={createNFT}
                  variant="primary"
                  size="lg"
                  className="custom-btn"
                >
                  Add an NFT and list for sale
                </Button>
              </div>
            </Row>
            <Row className="g-4">
              <div>
                <h1>Hello World!</h1>
                <button
                  onClick={() => {
                    takeScreenshot(imageRef)
                    alert('clicked')
                  }}
                >
                  Take Screenshot
                </button>
                {ticketImage && <img src={ticketImage} />}
                {<img src={ticketImage} />}
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AddItem
