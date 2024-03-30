// Third Party
import React, { useState } from "react";
import { Row, Col, Card, Stack, Modal } from "react-bootstrap";

// Utilities
import { formatUnixTimestamp } from "../../utilities/utilities";

const News = ({ news }) => {
  const [selectedNews, setSelectedNews] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const generateTwitterShareLink = () => {
    if (selectedNews) {
      const title = encodeURIComponent(selectedNews.headline);
      const url = encodeURIComponent(selectedNews.url);
      return `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
    }
    return "";
  };

  const generateFacebookShareLink = () => {
    if (selectedNews) {
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        selectedNews.url
      )}`;
    }
    return "";
  };

  const handleCardClick = (index) => {
    setSelectedNews(news[index]);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Row>
      {news.map((item, index) => (
        <Col key={index} xs={12} sm={6}>
          <Card
            className="mb-4"
            style={{ backgroundColor: "#f9f9f9", cursor: "pointer" }}
            onClick={() => handleCardClick(index)}
          >
            <Card.Body
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: "8.5rem" }}
            >
              <Stack
                direction="horizontal"
                gap={4}
                className="flex-column flex-md-row"
              >
                <Col sm={3} lg={2}>
                  <Card.Img src={item.image} className="img-fluid" />
                </Col>
                <Col sm={8}>
                  <Card.Text className="text-center">{item.headline}</Card.Text>
                </Col>
              </Stack>
            </Card.Body>
          </Card>
        </Col>
      ))}

      <Modal show={showModal} onHide={handleCloseModal}>
        {selectedNews && (
          <>
            <Modal.Header style={{ paddingBottom: 0 }}>
              <Stack>
                <Modal.Title>
                  <p className="h1">{selectedNews.source}</p>
                </Modal.Title>
                <p className="text-muted" style={{ marginTop: "-0.5rem" }}>
                  {formatUnixTimestamp(selectedNews.datetime)}
                </p>
              </Stack>

              <i
                className="bi bi-x fs-5 text-primary text-decoration-underline"
                style={{ borderBottom: "2px solid #0d6efd", cursor: "pointer" }}
                onClick={handleCloseModal}
              ></i>
            </Modal.Header>
            <Modal.Body>
              <Stack>
                <p className="h4">{selectedNews.headline}</p>
                <p style={{ marginTop: "-0.5rem" }}>{selectedNews.summary}</p>
                <p className="text-muted" style={{ marginTop: "-1rem" }}>
                  For more info click{" "}
                  <a href={selectedNews.url} target="__blank">
                    here
                  </a>
                </p>
              </Stack>
            </Modal.Body>
            <div className=" border border-2 py-3 mx-3 mb-3">
              <p className="mx-3">Share</p>
              <Stack direction="horizontal" className="mx-3" gap={2}>
                <a
                  href={generateTwitterShareLink()}
                  target="_blank"
                  rel="noreferrer"
                >
                  <i
                    className="bi bi-twitter-x fs-2"
                    style={{ color: "black" }}
                  ></i>
                </a>

                <a
                  href={generateFacebookShareLink()}
                  rel="noreferrer"
                  target="_blank"
                >
                  <i
                    class="fa-brands fa-square-facebook fs-1"
                    style={{ color: "blue" }}
                  ></i>
                </a>
              </Stack>
            </div>
          </>
        )}
      </Modal>
    </Row>
  );
};

export default News;
