import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { fetchContent } from "@/services/PlayerService";
import { useRouter } from "next/router";
import ConfirmActionPopup from "../../../../components/ConfirmActionPopup";
import ReviewCommentPopup from "../../../../components/ReviewCommentPopup";
import { publishContent, submitComment } from "@/services/ContentService";
import Players from "@/components/players/Players";
import { playerConfig } from "../../../../components/players/PlayerConfig";
import {
  pdfMetadata,
  videoMetadata,
  quMLMetadata,
  epubMetadata,
} from "../../../../components/players/playerMetadata";
import $ from "jquery";

const ReviewContentSubmissions = () => {
  const router = useRouter();
  const { identifier } = router.query;
  // const identifier = "do_2141610327664312321258";

  const [contentDetails, setContentDetails] = useState<any>(undefined);
  const [openConfirmationPopup, setOpenConfirmationPopup] = useState(false);
  const [confirmationActionType, setConfirmationActionType] = useState<
    "publish" | ""
  >("");
  const [openCommentPopup, setOpenCommentPopup] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.$ = window.jQuery = $;
    }

    const loadContent = async () => {
      try {
        if (identifier) {
          const data = await fetchContent(identifier);
          // playerConfig.metadata = videoMetadata;
          // playerConfig.metadata = pdfMetadata;
          // playerConfig.metadata = quMLMetadata;
          playerConfig.metadata = epubMetadata;
          console.log(playerConfig);
          console.log("data ==>", data);
          setContentDetails(data);
        }
      } catch (error) {
        console.error("Failed to fetch content:", error);
      }
    };

    if (identifier) {
      loadContent();
    }
  }, [identifier]);

  const redirectToReviewPage = () => {
    router.push({ pathname: `/workspace/content/submitted` });
  };

  const closePublishPopup = () => {
    setOpenConfirmationPopup(false);
  };

  const closeCommentPopup = () => {
    setOpenCommentPopup(false);
  };

  const handleReject = () => {
    console.log("Reject button clicked");
    setOpenCommentPopup(true);
  };

  const handlePublish = () => {
    console.log("Publish button clicked");
    setConfirmationActionType("publish");
    setOpenConfirmationPopup(true);
  };

  const confirmPublishContent = async () => {
    try {
      const response = await publishContent(identifier);
      console.log("Published successfully:", response);
      // Add toaster success message here
      setOpenConfirmationPopup(false);
      router.push({ pathname: `/workspace/content/submitted` });
    } catch (error) {
      console.error("Error during publishing:", error);
      // Add toaster error message here
    }
  };

  const handleSubmitComment = async (comment: string) => {
    try {
      const response = await submitComment(identifier, comment);
      console.log("Comment submitted successfully:", response);
      // Add toaster success message here
      setOpenCommentPopup(false);
    } catch (error) {
      console.error("Error submitting comment:", error);
      // Add toaster error message here
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Card sx={{ padding: 2, backgroundColor: "white" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography
          variant="h5"
          sx={{
            fontFamily: "inherit",
            fontWeight: 400,
            fontSize: "22px",
            lineHeight: "24px",
            letterSpacing: "0.5px",
            textAlign: "left",
            margin: "1.5rem 1.2rem 0.8rem",
            color: "#1F1B13",
          }}
          color="primary"
        >
          Review Content Submissions
        </Typography>
        <IconButton onClick={redirectToReviewPage}>
          <CloseIcon />
        </IconButton>
      </Box>

      {contentDetails ? (
        <>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Box
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "16px",
                  padding: 2,
                  backgroundColor: "white",
                  mb: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "inherit",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "24px",
                    letterSpacing: "0.5px",
                    textAlign: "left",
                    margin: "1.5rem 1.2rem 0.8rem",
                    color: "#1F1B13",
                  }}
                  color="primary"
                >
                  {contentDetails.name}
                </Typography>
                <Box
                  sx={{
                    // border: "1px solid #D0C5B4",
                    height: "500px",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "16px",
                  }}
                >
                  <div style={{ height: "100%", width: "100%" }}>
                    <Players playerConfig={playerConfig} />
                  </div>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <CardContent
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "16px",
                  backgroundColor: "white",
                  height: "607px",
                  overflow: "auto",
                }}
              >
                <Typography
                  sx={{ color: "#1F1B13", fontSize: "22px", mb: 2 }}
                  variant="h6"
                  color="primary"
                >
                  Content Details
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      fontWeight: "600",
                      color: "#969088",
                      fontSize: "12px",
                      mb: "4px",
                    }}
                  >
                    Name:
                  </Box>
                  <Box
                    sx={{
                      fontWeight: "400",
                      color: "#4D4639",
                      fontSize: "16px",
                    }}
                  >
                    {contentDetails.name}
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      fontWeight: "600",
                      color: "#969088",
                      fontSize: "12px",
                      mb: "4px",
                    }}
                  >
                    Creator:
                  </Box>
                  <Box
                    sx={{
                      fontWeight: "400",
                      color: "#4D4639",
                      fontSize: "16px",
                    }}
                  >
                    {contentDetails.creator}
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      fontWeight: "600",
                      color: "#969088",
                      fontSize: "12px",
                      mb: "4px",
                    }}
                  >
                    Description:
                  </Box>
                  <Box
                    sx={{
                      fontWeight: "400",
                      color: "#4D4639",
                      fontSize: "16px",
                    }}
                  >
                    {contentDetails.description}
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      fontWeight: "600",
                      color: "#969088",
                      fontSize: "12px",
                      mb: "4px",
                    }}
                  >
                    Primary Category:
                  </Box>
                  <Box
                    sx={{
                      fontWeight: "400",
                      color: "#4D4639",
                      fontSize: "16px",
                    }}
                  >
                    {contentDetails.primaryCategory}
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      fontWeight: "600",
                      color: "#969088",
                      fontSize: "12px",
                      mb: "4px",
                    }}
                  >
                    Created On:
                  </Box>
                  <Box
                    sx={{
                      fontWeight: "400",
                      color: "#4D4639",
                      fontSize: "16px",
                    }}
                  >
                    {formatDate(contentDetails.createdOn)}
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      fontWeight: "600",
                      color: "#969088",
                      fontSize: "12px",
                      mb: "4px",
                    }}
                  >
                    Last Update:
                  </Box>
                  <Box
                    sx={{
                      fontWeight: "400",
                      color: "#4D4639",
                      fontSize: "16px",
                    }}
                  >
                    {formatDate(contentDetails.lastUpdatedOn)}
                  </Box>
                </Box>
              </CardContent>
            </Grid>
          </Grid>

          <CardActions
            disableSpacing
            sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handlePublish}
              sx={{ marginRight: 1 }}
            >
              Publish
            </Button>
            <Button variant="contained" color="primary" onClick={handleReject}>
              Request Changes
            </Button>
          </CardActions>
        </>
      ) : (
        <Typography>No content details available</Typography>
      )}

      <ConfirmActionPopup
        open={openConfirmationPopup}
        onClose={closePublishPopup}
        actionType={confirmationActionType}
        onConfirm={confirmPublishContent}
      />

      <ReviewCommentPopup
        open={openCommentPopup}
        onClose={closeCommentPopup}
        onSubmit={handleSubmitComment}
        title="Submit Your Comment"
      />
    </Card>
  );
};

export default ReviewContentSubmissions;
