<template>
    <div class="landing-page">
      <!-- Hero Section -->
      <v-container fluid class="hero-section">
        <div class="hero-overlay"></div>
        <v-row align="center" justify="center" class="fill-height">
          <v-col cols="12" md="6" class="text-center text-md-left hero-content">
            <div class="hero-text">
              <h1 class="display-3 font-weight-bold mb-4">
                <span class="gradient-text">Revolutionize</span> Your Fleet Operations
              </h1>
              <p class="headline font-weight-light mb-6">AI-powered fleet management with real-time insights and predictive analytics</p>
              <div class="cta-buttons">
                <v-btn
                  x-large
                  rounded
                  color="primary"
                  to="/register"
                  class="mr-4 mb-4"
                  elevation="6"
                  dark
                >
                  Get Started Free
                  <v-icon right>mdi-arrow-right</v-icon>
                </v-btn>
                <v-btn
                  x-large
                  rounded
                  outlined
                  color="white"
                  to="/demo"
                  class="mb-4"
                  elevation="6"
                >
                  <v-icon left>mdi-play-circle</v-icon>
                  Watch Demo
                </v-btn>
              </div>
              <div class="trust-badges mt-8">
                <div class="trusted-by">Trusted by industry leaders:</div>
                <div class="badges">
                  <v-img src="https://via.placeholder.com/80x30?text=FedEx" max-width="80" class="mr-4"></v-img>
                  <v-img src="https://via.placeholder.com/80x30?text=UPS" max-width="80" class="mr-4"></v-img>
                  <v-img src="https://via.placeholder.com/80x30?text=DHL" max-width="80"></v-img>
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="6" class="text-center hero-image-col">
            <div class="hero-image-container">
              <v-img
                src="https://via.placeholder.com/600x500?text=Fleet+Dashboard"
                class="hero-image"
                contain
              ></v-img>
              <div class="floating-vehicle floating-1">
                <v-icon size="48" color="primary">mdi-truck-delivery</v-icon>
              </div>
              <div class="floating-vehicle floating-2">
                <v-icon size="48" color="green">mdi-truck-check</v-icon>
              </div>
              <div class="floating-vehicle floating-3">
                <v-icon size="48" color="accent">mdi-truck-alert</v-icon>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
  
      <!-- Stats Section -->
      <div class="stats-section py-8">
        <v-container>
          <v-row class="justify-center">
            <v-col cols="6" sm="3" v-for="(stat, i) in stats" :key="i" class="text-center">
              <div class="stat-number">{{ stat.number }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </v-col>
          </v-row>
        </v-container>
      </div>
  
      <!-- Features Section -->
      <v-container class="features-section py-12">
        <v-row>
          <v-col cols="12" class="text-center mb-8">
            <div class="section-subtitle">POWERFUL FEATURES</div>
            <h2 class="display-2 font-weight-bold mb-4">Everything You Need to <span class="gradient-text">Optimize</span> Your Fleet</h2>
            <p class="subtitle-1">Advanced tools designed to reduce costs and improve efficiency</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4" v-for="(feature, i) in features" :key="i">
            <v-card class="feature-card pa-6" elevation="4" rounded="xl" :style="`border-top: 4px solid ${feature.color}`">
              <div class="feature-icon" :style="`background-color: ${feature.lightColor}`">
                <v-icon x-large :color="feature.color">{{ feature.icon }}</v-icon>
              </div>
              <h3 class="headline mb-3">{{ feature.title }}</h3>
              <p class="body-1">{{ feature.description }}</p>
              <v-btn text :color="feature.color" class="mt-4 pl-0">
                Learn more <v-icon right>mdi-arrow-right</v-icon>
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
  
      <!-- Real-Time Tracking Demo -->
      <div class="demo-section py-12">
        <v-container>
          <v-row align="center">
            <v-col cols="12" md="6" class="pr-md-8">
              <div class="section-subtitle">REAL-TIME MONITORING</div>
              <h2 class="display-1 font-weight-bold mb-4">Live Fleet Tracking <span class="gradient-text">Anywhere</span></h2>
              <p class="body-1 mb-4">Our advanced GPS technology provides centimeter-level accuracy with updates every 10 seconds. Monitor your entire fleet from a single dashboard.</p>
              <ul class="feature-list">
                <li v-for="(item, i) in trackingFeatures" :key="i" class="mb-3">
                  <div class="feature-list-item">
                    <div class="feature-icon-small" :style="`background-color: ${trackingFeaturesColors[i]}`">
                      <v-icon color="white" small>mdi-check</v-icon>
                    </div>
                    <span>{{ item }}</span>
                  </div>
                </li>
              </ul>
            </v-col>
            <v-col cols="12" md="6" class="text-center">
              <div class="demo-card-container">
                <v-card class="demo-card pa-2" elevation="10" rounded="xl">
                  <div class="map-placeholder">
                    <v-img src="https://via.placeholder.com/600x400?text=Live+Map+View" aspect-ratio="1.5" class="rounded-lg"></v-img>
                  </div>
                  <div class="demo-controls pa-4">
                    <v-slider
                      color="primary"
                      thumb-color="primary"
                      track-color="grey lighten-2"
                      value="75"
                    ></v-slider>
                    <div class="d-flex justify-space-between">
                      <v-btn small text color="primary">
                        <v-icon left>mdi-rewind</v-icon> Rewind
                      </v-btn>
                      <v-btn small text color="primary">
                        Playback <v-icon right>mdi-play</v-icon>
                      </v-btn>
                      <v-btn small text color="primary">
                        Analyze <v-icon right>mdi-chart-bar</v-icon>
                      </v-btn>
                    </div>
                  </div>
                </v-card>
                <div class="demo-highlight demo-highlight-1"></div>
                <div class="demo-highlight demo-highlight-2"></div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
  
      <!-- AI Section -->
      <div class="ai-section py-12">
        <v-container>
          <v-row align="center">
            <v-col cols="12" md="6" class="text-center order-last order-md-first">
              <div class="ai-visual">
                <v-img src="https://via.placeholder.com/500x400?text=AI+Analytics" class="ai-image" contain></v-img>
                <div class="ai-pulse"></div>
                <div class="ai-data-point" style="top: 20%; left: 30%;">
                  <div class="data-point-value">+15%</div>
                  <div class="data-point-label">Efficiency</div>
                </div>
                <div class="ai-data-point" style="top: 60%; left: 70%;">
                  <div class="data-point-value">-12%</div>
                  <div class="data-point-label">Fuel Cost</div>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="6" class="pl-md-8 order-first order-md-last">
              <div class="section-subtitle">AI-POWERED INSIGHTS</div>
              <h2 class="display-1 font-weight-bold mb-4">Predictive <span class="gradient-text">Analytics</span> That Drive Results</h2>
              <p class="body-1 mb-4">Our machine learning algorithms analyze historical and real-time data to predict maintenance needs, optimize routes, and reduce operational costs.</p>
              <v-list class="transparent">
                <v-list-item v-for="(benefit, i) in aiBenefits" :key="i" class="pl-0">
                  <v-list-item-icon class="mr-4">
                    <v-icon color="primary">mdi-check-circle</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="font-weight-medium">{{ benefit }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-btn x-large rounded color="primary" dark class="mt-6">
                Explore AI Features
                <v-icon right>mdi-robot</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </div>
  
      <!-- Testimonials -->
      <v-container class="testimonials-section py-12">
        <v-row>
          <v-col cols="12" class="text-center mb-8">
            <div class="section-subtitle">CLIENT SUCCESS STORIES</div>
            <h2 class="display-1 font-weight-bold mb-4">What Our <span class="gradient-text">Clients</span> Say</h2>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4" v-for="(testimonial, i) in testimonials" :key="i">
            <v-card class="testimonial-card pa-6" elevation="2" rounded="xl">
              <div class="quote-icon">
                <v-icon color="grey lighten-1">mdi-format-quote-open</v-icon>
              </div>
              <v-rating
                v-model="testimonial.rating"
                color="amber"
                dense
                half-increments
                readonly
                size="20"
                class="mb-3"
              ></v-rating>
              <p class="body-1 font-italic mb-4">"{{ testimonial.quote }}"</p>
              <div class="d-flex align-center">
                <v-avatar size="48" class="mr-4" color="primary lighten-4">
                  <v-img :src="`https://randomuser.me/api/portraits/${testimonial.gender}/${i+10}.jpg`"></v-img>
                </v-avatar>
                <div>
                  <div class="subtitle-1 font-weight-bold">{{ testimonial.name }}</div>
                  <div class="caption">{{ testimonial.position }}, {{ testimonial.company }}</div>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
  
      <!-- CTA Section -->
      <div class="cta-section py-12">
        <v-container>
          <v-row justify="center">
            <v-col cols="12" md="8" class="text-center">
              <h2 class="display-1 font-weight-bold mb-4">Ready to Transform Your Fleet Operations?</h2>
              <p class="headline font-weight-light mb-6">Join thousands of businesses optimizing their fleets with our platform</p>
              <div class="cta-actions">
                <v-btn
                  x-large
                  rounded
                  color="primary"
                  to="/register"
                  class="mr-4 mb-4"
                  elevation="6"
                  dark
                >
                  Start Free Trial
                  <v-icon right>mdi-rocket</v-icon>
                </v-btn>
                <v-btn
                  x-large
                  rounded
                  outlined
                  color="white"
                  to="/demo"
                  class="mb-4"
                  elevation="6"
                >
                  <v-icon left>mdi-calendar</v-icon>
                  Schedule Demo
                </v-btn>
              </div>
              <div class="cta-note mt-4">
                <v-icon small color="white" class="mr-2">mdi-shield-check</v-icon>
                No credit card required • 14-day free trial • Cancel anytime
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
  
      <!-- Footer -->
      <v-footer class="landing-footer">
        <v-container>
          <v-row>
            <v-col cols="12" md="4" class="footer-brand">
              <div class="d-flex align-center mb-4">
                <v-icon size="40" color="primary" class="mr-2">mdi-truck</v-icon>
                <span class="text-h5 font-weight-bold">FleetPro</span>
              </div>
              <p class="body-2">Advanced fleet management solutions for modern businesses.</p>
              <div class="social-icons mt-4">
                <v-btn icon color="grey darken-1" class="mr-2">
                  <v-icon>mdi-facebook</v-icon>
                </v-btn>
                <v-btn icon color="grey darken-1" class="mr-2">
                  <v-icon>mdi-twitter</v-icon>
                </v-btn>
                <v-btn icon color="grey darken-1" class="mr-2">
                  <v-icon>mdi-linkedin</v-icon>
                </v-btn>
                <v-btn icon color="grey darken-1">
                  <v-icon>mdi-instagram</v-icon>
                </v-btn>
              </div>
            </v-col>
            <v-col cols="6" md="2" class="footer-links">
              <div class="footer-title mb-4">Product</div>
              <v-list dense class="transparent">
                <v-list-item v-for="(item, i) in footerLinks.product" :key="i" class="pl-0">
                  <v-list-item-title class="body-2">{{ item }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="6" md="2" class="footer-links">
              <div class="footer-title mb-4">Resources</div>
              <v-list dense class="transparent">
                <v-list-item v-for="(item, i) in footerLinks.resources" :key="i" class="pl-0">
                  <v-list-item-title class="body-2">{{ item }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="6" md="2" class="footer-links">
              <div class="footer-title mb-4">Company</div>
              <v-list dense class="transparent">
                <v-list-item v-for="(item, i) in footerLinks.company" :key="i" class="pl-0">
                  <v-list-item-title class="body-2">{{ item }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="6" md="2" class="footer-links">
              <div class="footer-title mb-4">Support</div>
              <v-list dense class="transparent">
                <v-list-item v-for="(item, i) in footerLinks.support" :key="i" class="pl-0">
                  <v-list-item-title class="body-2">{{ item }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
          <v-divider class="my-6"></v-divider>
          <v-row>
            <v-col cols="12" md="6" class="text-center text-md-left">
              <span class="caption">© 2023 FleetPro. All rights reserved.</span>
            </v-col>
            <v-col cols="12" md="6" class="text-center text-md-right">
              <span class="caption mr-4">Privacy Policy</span>
              <span class="caption mr-4">Terms of Service</span>
              <span class="caption">Cookie Policy</span>
            </v-col>
          </v-row>
        </v-container>
      </v-footer>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const stats = ref([
    {
      number: '15,000+',
      label: 'Fleet Vehicles Managed'
    },
    {
      number: '27%',
      label: 'Average Cost Reduction'
    },
    {
      number: '98.7%',
      label: 'Customer Satisfaction'
    },
    {
      number: '45+',
      label: 'Countries Served'
    }
  ]);
  
  const features = ref([
    {
      icon: 'mdi-map-marker-path',
      title: 'Live GPS Tracking',
      description: 'Real-time vehicle tracking with historical route playback and geofencing capabilities.',
      color: '#4CAF50',
      lightColor: '#E8F5E9'
    },
    {
      icon: 'mdi-chart-areaspline',
      title: 'Advanced Analytics',
      description: 'Comprehensive reporting on fuel usage, driver behavior, and operational metrics.',
      color: '#2196F3',
      lightColor: '#E3F2FD'
    },
    {
      icon: 'mdi-robot',
      title: 'AI Predictions',
      description: 'Predictive maintenance alerts and optimized routing using machine learning.',
      color: '#FF9800',
      lightColor: '#FFF3E0'
    }
  ]);
  
  const trackingFeatures = ref([
    'Real-time vehicle locations with 10-second updates',
    'Historical route playback and analysis',
    'Custom geofencing with instant alerts',
    'Driver behavior scoring system',
    'Fuel efficiency monitoring and reporting',
    'Predictive maintenance scheduling'
  ]);
  
  const trackingFeaturesColors = [
    '#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', '#00BCD4'
  ];
  
  const aiBenefits = ref([
    'Predict vehicle maintenance needs before breakdowns occur',
    'Optimize routes based on traffic, weather, and historical data',
    'Identify inefficient driving patterns and reduce fuel costs',
    'Automate compliance reporting for regulations'
  ]);
  
  const testimonials = ref([
    {
      quote: 'This platform reduced our operational costs by 22% in the first 6 months. The ROI was immediate and substantial.',
      name: 'Emma Wilson',
      position: 'Director of Operations',
      company: 'Global Transport',
      rating: 5,
      gender: 'women'
    },
    {
      quote: 'The real-time tracking and predictive analytics have completely transformed how we manage our 300+ vehicle fleet.',
      name: 'James Patel',
      position: 'Fleet Manager',
      company: 'Urban Logistics',
      rating: 4.5,
      gender: 'men'
    },
    {
      quote: 'Implementation was seamless and the customer support is exceptional. Our drivers love the intuitive mobile app.',
      name: 'Laura Martinez',
      position: 'CEO',
      company: 'FastFreight Co.',
      rating: 5,
      gender: 'women'
    }
  ]);
  
  const footerLinks = ref({
    product: ['Features', 'Pricing', 'Integrations', 'Updates', 'Roadmap'],
    resources: ['Blog', 'Guides', 'Webinars', 'API Docs', 'Case Studies'],
    company: ['About Us', 'Careers', 'Partners', 'Press', 'Contact'],
    support: ['Help Center', 'Community', 'Training', 'Status', 'Feedback']
  });
  </script>
  
  <style scoped>
  .landing-page {
    overflow-x: hidden;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  
  /* Gradient Text */
  .gradient-text {
    background: linear-gradient(90deg, #2196F3 0%, #4CAF50 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
  
  /* Hero Section */
  .hero-section {
    background: linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%);
    height: 90vh;
    min-height: 700px;
    position: relative;
    overflow: hidden;
    color: white;
  }
  
  .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==');
  }
  
  .hero-content {
    position: relative;
    z-index: 2;
  }
  
  .hero-text h1 {
    font-size: 3.5rem;
    line-height: 1.2;
    margin-bottom: 1.5rem;
  }
  
  .hero-image-col {
    position: relative;
    z-index: 2;
  }
  
  .hero-image-container {
    position: relative;
    height: 100%;
  }
  
  .hero-image {
    max-height: 500px;
    filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.3));
    animation: float 6s ease-in-out infinite;
  }
  
  .floating-vehicle {
    position: absolute;
    animation: float 8s ease-in-out infinite;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  }
  
  .floating-1 {
    top: 10%;
    left: 10%;
    animation-delay: 0s;
  }
  
  .floating-2 {
    top: 60%;
    left: 20%;
    animation-delay: 1s;
  }
  
  .floating-3 {
    top: 30%;
    left: 70%;
    animation-delay: 2s;
  }
  
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }
  
  .trust-badges {
    margin-top: 2rem;
  }
  
  .trusted-by {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 0.5rem;
  }
  
  .badges {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  
  /* Stats Section */
  .stats-section {
    background: white;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    margin-top: -50px;
    position: relative;
    z-index: 3;
    border-radius: 12px;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: #2196F3;
    line-height: 1;
    margin-bottom: 0.5rem;
  }
  
  .stat-label {
    font-size: 0.9rem;
    color: #666;
    font-weight: 500;
  }
  
  /* Section Subtitle */
  .section-subtitle {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #2196F3;
    margin-bottom: 1rem;
  }
  
  /* Features Section */
  .features-section {
    background-color: #f9fbfd;
  }
  
  .feature-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    height: 100%;
    background: white;
    position: relative;
    overflow: hidden;
  }
  
  .feature-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) !important;
  }
  
  .feature-icon {
    width: 70px;
    height: 70px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
  }
  
  /* Demo Section */
  .demo-section {
    background-color: white;
  }
  
  .demo-card-container {
    position: relative;
  }
  
  .demo-card {
    transition: transform 0.3s ease;
    background: white;
    position: relative;
    z-index: 2;
  }
  
  .demo-highlight {
    position: absolute;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: rgba(33, 150, 243, 0.1);
    z-index: 1;
  }
  
  .demo-highlight-1 {
    top: -20px;
    right: -20px;
  }
  
  .demo-highlight-2 {
    bottom: -30px;
    left: -30px;
  }
  
  .map-placeholder {
    border-radius: 12px;
    overflow: hidden;
  }
  
  .feature-list-item {
    display: flex;
    align-items: center;
  }
  
  .feature-icon-small {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    flex-shrink: 0;
  }
  
  /* AI Section */
  .ai-section {
    background-color: #f9fbfd;
  }
  
  .ai-visual {
    position: relative;
    max-width: 500px;
    margin: 0 auto;
  }
  
  .ai-image {
    position: relative;
    z-index: 2;
    filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));
  }
  
  .ai-pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: rgba(33, 150, 243, 0.1);
    z-index: 1;
    animation: pulse 3s ease-out infinite;
  }
  
  .ai-data-point {
    position: absolute;
    background: white;
    border-radius: 8px;
    padding: 8px 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 3;
    animation: float 4s ease-in-out infinite;
  }
  
  .data-point-value {
    font-weight: 700;
    color: #2196F3;
    font-size: 1.2rem;
    line-height: 1;
  }
  
  .data-point-label {
    font-size: 0.7rem;
    color: #666;
  }
  
  @keyframes pulse {
    0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.7; }
    70% { transform: translate(-50%, -50%) scale(1.1); opacity: 0; }
    100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0; }
  }
  
  /* Testimonials */
  .testimonials-section {
    background-color: white;
  }
  
  .testimonial-card {
    transition: transform 0.3s ease;
    height: 100%;
    background: white;
    position: relative;
    overflow: hidden;
  }
  
  .testimonial-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) !important;
  }
  
  .quote-icon {
    position: absolute;
    top: 20px;
    right: 20px;
    opacity: 0.1;
    font-size: 60px;
  }
  
  /* CTA Section */
  .cta-section {
    background: linear-gradient(135deg, #2196F3 0%, #4CAF50 100%);
    position: relative;
    overflow: hidden;
    color: white;
  }
  
  .cta-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==');
  }
  
  .cta-actions {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .cta-note {
    font-size: 0.9rem;
    opacity: 0.9;
  }
  
  /* Footer */
  .landing-footer {
    background: #0F2027;
    color: white;
  }
  
  .footer-title {
    font-weight: 600;
    color: #B0BEC5;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 0.8rem;
  }
  
  /* Responsive adjustments */
  @media (max-width: 960px) {
    .hero-section {
      height: auto;
      padding: 100px 0;
      text-align: center;
    }
    
    .hero-text h1 {
      font-size: 2.5rem;
    }
    
    .hero-image {
      max-height: 400px;
      margin-top: 50px;
    }
    
    .trust-badges {
      justify-content: center;
    }
    
    .badges {
      justify-content: center;
    }
    
    .stats-section {
      margin-top: 0;
      border-radius: 0;
    }
    
    .stat-number {
      font-size: 2rem;
    }
  }
  
  @media (max-width: 600px) {
    .hero-text h1 {
      font-size: 2rem;
    }
    
    .display-1, .display-2 {
      font-size: 1.8rem !important;
    }
    
    .stat-number {
      font-size: 1.8rem;
    }
    
    .cta-actions .v-btn {
      width: 100%;
      margin-bottom: 16px !important;
    }
    
    .footer-links {
      margin-bottom: 2rem;
    }
  }
  </style>