import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Typography,
  Box,
  IconButton,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import { Status } from "@/utils/app.constant";

interface ContentCardProps {
  title: string;
  description?: string;
  type: string;
  imageUrl?: string;
  status: string;
  onDelete?: () => void;
}

const CourseCard: React.FC<ContentCardProps> = ({
  title,
  description,
  type,
  imageUrl,
  status,
  onDelete,
}) => {
  const theme = useTheme<any>();

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        width: "250px",
      }}
    >
      <Box position="relative">
        <CardMedia
          component="div"
          sx={{
            height: 140,
            backgroundColor: theme.palette.info.contrastText,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {imageUrl ? (
            <img src={imageUrl} alt={title} />
          ) : (
            <ImageIcon fontSize="large" />
          )}
        </CardMedia>

        <Chip
          label={type}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: theme.palette.warning["100"],
            color: theme.palette.warning["A700"],
          }}
        />
      </Box>
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      {(status === Status.DRAFT || status === Status.LIVE) && (
        <CardActions disableSpacing>
          <Box display="flex" justifyContent="flex-end" width="100%">
            <IconButton aria-label="delete" onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </CardActions>
      )}
    </Card>
  );
};

export default CourseCard;
