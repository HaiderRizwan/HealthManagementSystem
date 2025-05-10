import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Paper,
} from "@mui/material";
import Star from "@mui/icons-material/Star";
import { styled } from "@mui/system";

// Import placeholder images
import placeholderImages from "../Assets/placeholderImages";

// Fallback image for any missing images
const fallbackImage = placeholderImages.fallback;

const Header = styled("div")({
  textAlign: "center",
  margin: "2rem 0",
  background: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
  padding: "1.5rem",
  color: "white",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
  borderRadius: "8px",
});

const ArticleCard = styled(Card)({
  margin: "1rem",
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  height: "100%",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 20px rgba(0, 0, 0, 0.2)",
  },
  backgroundColor: "white",
  borderRadius: "12px",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
});

const Image = styled("img")({
  width: "100%",
  height: "180px",
  objectFit: "cover",
  borderRadius: "12px 12px 0 0",
  transition: "transform 0.5s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
});

const MostViewed = styled(Paper)({
  textAlign: "center",
  margin: "4rem 0",
  padding: "2rem",
  borderRadius: "12px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
  background: "linear-gradient(to bottom, #ffffff, #f5f5f5)",
});

const CategoryHeader = styled(Typography)({
  fontWeight: "bold",
  padding: "0.75rem 1rem",
  borderRadius: "8px",
  marginBottom: "1.5rem",
  background: "linear-gradient(90deg, #e3f2fd 0%, #bbdefb 100%)",
  color: "#0d47a1",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
});

const Footer = styled("footer")({
  background: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
  padding: "40px 0",
  color: "#ffffff",
  borderRadius: "12px 12px 0 0",
  marginTop: "3rem",
});

const FooterHeading = styled(Typography)({
  fontSize: "32px",
  fontWeight: "bold",
  marginBottom: "30px",
  textAlign: "center",
});

const FooterLink = styled("a")({
  color: "#f0f0f0",
  textDecoration: "none",
  marginRight: "30px",
  transition: "color 0.3s, transform 0.2s",
  fontSize: "18px",
  display: "inline-block",
  "&:hover": {
    color: "#90caf9",
    transform: "translateY(-3px)",
  },
});

const FooterTableContainer = styled(TableContainer)({
  marginTop: "30px",
  background: "rgba(255, 255, 255, 0.1)",
  borderRadius: "8px",
});

const FooterTableCell = styled(TableCell)({
  padding: "15px 20px",
  color: "white",
  borderColor: "rgba(255, 255, 255, 0.2)",
});

// Function to get image source with fallback
const getImageSrc = (imageName) => {
  switch(imageName) {
    case "sleepimg.jpg": return placeholderImages.sleep;
    case "smoking.jpg": return placeholderImages.smoking;
    case "depressionn.jpg": return placeholderImages.mentalHealth;
    case "depression.jpg": return placeholderImages.depression;
    case "diet.jpg": return placeholderImages.diet;
    case "fruits.jpg": return placeholderImages.fruits;
    case "traditional_medicines.jpg": return placeholderImages.traditionalMedicine;
    case "zikavirus.jpg": return placeholderImages.zikaVirus;
    case "bmi.jpg": return placeholderImages.bmi;
    case "FEEDING.jpg": return placeholderImages.feeding;
    case "haze.PNG": return placeholderImages.haze;
    case "resilence.jpg": return placeholderImages.resilience;
    case "boredom.jpg": return placeholderImages.boredom;
    default: return fallbackImage;
  }
};

function HealthArticle() {
  const handleImageClick = (link) => {
    window.open(link, "_self");
  };

  const articles = [
    {
      title: "Importance of Sleep",
      imageUrl: "sleepimg.jpg",
      link: "https://www.healthhub.sg/live-healthy/sleep",
    },
    {
      title: "How to Quit Smoking Gradually",
      imageUrl: "smoking.jpg",
      link: "https://www.healthhub.sg/live-healthy/gradual-reduction-in-a-nutshell",
    },
    {
      title: "Healthy Mind: Tips For A Healthy Brain!",
      imageUrl: "depressionn.jpg",
      link: "https://www.healthhub.sg/live-healthy/healthy-brain",
    },
    {
      title: "How To Identify And Deal With Depression",
      imageUrl: "depression.jpg",
      link: "https://www.healthhub.sg/live-healthy/how-to-identify-and-deal-with-depression",
    },
    {
      title: "Diet vs Exercise",
      imageUrl: "diet.jpg",
      link: "https://www.healthhub.sg/live-healthy/2015-oct-nhg-die",
    },
    {
      title: "Benefits of Fruits: Fun Fruity Facts for Health",
      imageUrl: "fruits.jpg",
      link: "https://www.healthhub.sg/live-healthy/fun-fruity-facts",
    },
  ];

  const mostViewedArticles = [
    {
      category: "Alerts and Advisories",
      title: "Guidelines for Traditional Medicinal Materials",
      imageUrl: "traditional_medicines.jpg",
      link: "https://www.healthhub.sg/live-healthy/guidelines-for-traditional-medicinal-materials",
    },
    {
      category: "Body Care",
      title: "The Importance of Sleep",
      imageUrl: "sleepimg.jpg",
      link: "https://www.healthhub.sg/live-healthy/sleep",
    },
    {
      category: "Child and Teen Health",
      title: "Helping Youth Fight Depression",
      imageUrl: "depressionn.jpg",
      link: "https://www.healthhub.sg/live-healthy/helping-youth-fight-depression",
    },
    {
      category: "Alerts and Advisories",
      title: "Health Advisory: Zika Virus Infection",
      imageUrl: "zikavirus.jpg",
      link: "https://www.healthhub.sg/live-healthy/health-advisory-zika-virus-infection",
    },
    {
      category: "Body Care",
      title: "Did You Know BMI Isn't The Same For Adults And Kids?",
      imageUrl: "bmi.jpg",
      link: "https://www.healthhub.sg/live-healthy/differencesbetweenchildandadultbmi",
    },
    {
      category: "Body Care",
      title: "Feeding Your Baby Solid Food: Baby's First Food Journey",
      imageUrl: "FEEDING.jpg",
      link: "https://www.healthhub.sg/live-healthy/babys_first_food_journey",
    },
    {
      category: "Alerts and Advisories",
      title: "How to Protect Yourself Against the Haze",
      imageUrl: "haze.PNG",
      link: "https://www.healthhub.sg/live-healthy/how-to-protect-yourself-against-haze",
    },
    {
      category: "Child and Teen Health",
      title: "Building Resilience In Your Child",
      imageUrl: "resilence.jpg",
      link: "https://www.healthhub.sg/live-healthy/building-resilience-in-your-child",
    },
    {
      category: "Child and Teen Health",
      title: "3 Ways Your Child Benefits From Boredom",
      imageUrl: "boredom.jpg",
      link: "https://www.healthhub.sg/live-healthy/daydreaming-kids-wondering-or-wandering-minds",
    },
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
      <Header>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Live Healthy
        </Typography>
        <Typography variant="h5" component="h2">
          Articles On Healthy Living
        </Typography>
      </Header>

      <Grid container spacing={3} justifyContent="center">
        {articles.map((article, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <ArticleCard onClick={() => handleImageClick(article.link)}>
              <Box sx={{ position: "relative", overflow: "hidden" }}>
                <Image 
                  src={getImageSrc(article.imageUrl)} 
                  alt={article.title}
                  onError={(e) => {
                    e.target.src = fallbackImage;
                  }}
                />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight="medium">
                  {article.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Click to read more about this topic
                </Typography>
              </CardContent>
            </ArticleCard>
          </Grid>
        ))}
      </Grid>

      <MostViewed>
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Star sx={{ color: "#ffd700", mr: 1, fontSize: 30 }} />
          <Typography variant="h3" component="h2" fontWeight="bold" color="primary">
            Most Viewed
</Typography>
          <Star sx={{ color: "#ffd700", ml: 1, fontSize: 30 }} />
        </Box>

        <Grid container spacing={4}>
          {/* Alerts and Advisories */}
          <Grid item xs={12} sm={4}>
            <CategoryHeader variant="h5">
              Alerts and Advisories
            </CategoryHeader>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {mostViewedArticles
              .filter((article) => article.category === "Alerts and Advisories")
              .slice(0, 3)
              .map((article, index) => (
                  <ArticleCard key={index} sx={{ m: 0 }}>
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Image
                        src={getImageSrc(article.imageUrl)}
                        alt={article.title}
                        onError={(e) => {
                          e.target.src = fallbackImage;
                        }}
                        />
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {article.title}
                        </Typography>
                      </CardContent>
                        </a>
                  </ArticleCard>
              ))}
            </Box>
          </Grid>

          {/* Body Care */}
          <Grid item xs={12} sm={4}>
            <CategoryHeader variant="h5">
              Body Care
            </CategoryHeader>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {mostViewedArticles
              .filter((article) => article.category === "Body Care")
              .slice(0, 3)
              .map((article, index) => (
                  <ArticleCard key={index} sx={{ m: 0 }}>
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Image
                        src={getImageSrc(article.imageUrl)}
                        alt={article.title}
                        onError={(e) => {
                          e.target.src = fallbackImage;
                        }}
                        />
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {article.title}
                        </Typography>
                      </CardContent>
                        </a>
                  </ArticleCard>
              ))}
            </Box>
          </Grid>

          {/* Child and Teen Health */}
          <Grid item xs={12} sm={4}>
            <CategoryHeader variant="h5">
              Child and Teen Health
            </CategoryHeader>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {mostViewedArticles
              .filter((article) => article.category === "Child and Teen Health")
              .slice(0, 3)
              .map((article, index) => (
                  <ArticleCard key={index} sx={{ m: 0 }}>
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Image
                        src={getImageSrc(article.imageUrl)}
                        alt={article.title}
                        onError={(e) => {
                          e.target.src = fallbackImage;
                        }}
                        />
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {article.title}
                        </Typography>
                      </CardContent>
                        </a>
                  </ArticleCard>
              ))}
            </Box>
          </Grid>
        </Grid>
      </MostViewed>

    <Footer>
        <Box sx={{ maxWidth: 1100, mx: "auto", px: 3 }}>
          <FooterHeading variant="h3">
            Health Resources
          </FooterHeading>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <FooterLink href="#">Health Articles</FooterLink>
                <FooterLink href="#">Find a Doctor</FooterLink>
                <FooterLink href="#">Emergency Services</FooterLink>
                <FooterLink href="#">Contact Us</FooterLink>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" gutterBottom>
                Health Topics
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <FooterLink href="#">Diabetes</FooterLink>
                <FooterLink href="#">Heart Health</FooterLink>
                <FooterLink href="#">Mental Health</FooterLink>
                <FooterLink href="#">Preventive Care</FooterLink>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Follow Us
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <FooterLink href="#">Facebook</FooterLink>
                <FooterLink href="#">Twitter</FooterLink>
                <FooterLink href="#">Instagram</FooterLink>
                <FooterLink href="#">YouTube</FooterLink>
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }}>
            <Typography variant="body2">
              © {new Date().getFullYear()} Health Management System. All rights reserved.
            </Typography>
          </Box>
        </Box>
    </Footer>
    </Box>
  );
}

export default HealthArticle;
