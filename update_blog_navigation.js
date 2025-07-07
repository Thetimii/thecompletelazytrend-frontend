const fs = require('fs');
const path = require('path');

const blogPosts = [
    'blog-top-tiktok-hashtags-2025.html',
    'blog-short-form-video-content-trends-2025.html',
    'blog-niche-social-media-platforms-2025.html'
];

const navigationHTML = `        <!-- Blog Navigation -->
        <nav class="blog-navigation">
            <div class="nav-header">
                <h3>🔗 Continue Reading</h3>
                <p>Explore more insights on social media trends and digital marketing</p>
            </div>
            
            <div class="nav-grid">
                <div class="nav-item">
                    <a href="blog-index.html" class="nav-link">
                        <div class="nav-icon">📚</div>
                        <div class="nav-content">
                            <h4>All Blog Posts</h4>
                            <p>Browse our complete collection of social media insights</p>
                        </div>
                    </a>
                </div>
                
                <div class="nav-item">
                    <a href="blog-social-media-trends-2025.html" class="nav-link">
                        <div class="nav-icon">🚀</div>
                        <div class="nav-content">
                            <h4>Social Media Trends 2025</h4>
                            <p>Complete guide to the future of digital marketing</p>
                        </div>
                    </a>
                </div>
                
                <div class="nav-item">
                    <a href="blog-ai-machine-learning-social-media-2025.html" class="nav-link">
                        <div class="nav-icon">🤖</div>
                        <div class="nav-content">
                            <h4>AI & Machine Learning</h4>
                            <p>How AI is revolutionizing social media engagement</p>
                        </div>
                    </a>
                </div>
                
                <div class="nav-item">
                    <a href="blog-social-commerce-revolution-2025.html" class="nav-link">
                        <div class="nav-icon">🛒</div>
                        <div class="nav-content">
                            <h4>Social Commerce Revolution</h4>
                            <p>The future of shopping on social platforms</p>
                        </div>
                    </a>
                </div>
                
                <div class="nav-item">
                    <a href="blog-top-tiktok-hashtags-2025.html" class="nav-link">
                        <div class="nav-icon">🎵</div>
                        <div class="nav-content">
                            <h4>Top TikTok Hashtags</h4>
                            <p>Trending hashtags to boost your TikTok reach</p>
                        </div>
                    </a>
                </div>
                
                <div class="nav-item">
                    <a href="blog-short-form-video-content-trends-2025.html" class="nav-link">
                        <div class="nav-icon">📱</div>
                        <div class="nav-content">
                            <h4>Short-Form Video Trends</h4>
                            <p>The evolution of quick-consumption content</p>
                        </div>
                    </a>
                </div>
                
                <div class="nav-item">
                    <a href="blog-niche-social-media-platforms-2025.html" class="nav-link">
                        <div class="nav-icon">🌟</div>
                        <div class="nav-content">
                            <h4>Niche Social Platforms</h4>
                            <p>Emerging platforms reshaping social interaction</p>
                        </div>
                    </a>
                </div>
            </div>
        </nav>
        
        <footer class="footer">
            <p>&copy; 2025 The Complete Lazy Trend. All rights reserved. | <a href="https://www.lazy-trends.com">Homepage</a> | <a href="blog-index.html">Blog Index</a></p>
        </footer>`;

const navigationCSS = `        
        .footer a {
            color: #3B82F6;
            text-decoration: none;
        }
        
        .footer a:hover {
            text-decoration: underline;
        }
        
        /* Blog Navigation Styles */
        .blog-navigation {
            margin: 40px 0;
            padding: 30px;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border-radius: 15px;
            border: 1px solid #e2e8f0;
        }
        
        .nav-header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .nav-header h3 {
            color: #1e293b;
            font-size: 1.5rem;
            margin-bottom: 8px;
        }
        
        .nav-header p {
            color: #64748b;
            font-size: 1rem;
            margin-bottom: 0;
        }
        
        .nav-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
        }
        
        .nav-item {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }
        
        .nav-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .nav-link {
            display: flex;
            align-items: center;
            padding: 20px;
            text-decoration: none;
            color: inherit;
        }
        
        .nav-icon {
            font-size: 2rem;
            margin-right: 15px;
            min-width: 50px;
        }
        
        .nav-content h4 {
            color: #1e293b;
            font-size: 1.1rem;
            margin-bottom: 5px;
            font-weight: 600;
        }
        
        .nav-content p {
            color: #64748b;
            font-size: 0.9rem;
            margin-bottom: 0;
            line-height: 1.4;
        }
        
            .nav-grid {
                grid-template-columns: 1fr;
            }
            
            .blog-navigation {
                padding: 20px;
                margin: 30px 0;
            }
            
            .nav-link {
                padding: 15px;
            }`;

blogPosts.forEach(filename => {
    const filePath = path.join(__dirname, filename);
    
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Add CSS before the last media query's closing brace
        if (!content.includes('Blog Navigation Styles')) {
            const lastMediaQueryIndex = content.lastIndexOf('}', content.lastIndexOf('@media'));
            if (lastMediaQueryIndex !== -1) {
                content = content.slice(0, lastMediaQueryIndex) + 
                         navigationCSS + 
                         '\n        ' + content.slice(lastMediaQueryIndex);
            }
        }
        
        // Replace footer with navigation + footer
        if (!content.includes('blog-navigation')) {
            const footerPattern = /<footer class="footer">[\s\S]*?<\/footer>/;
            if (footerPattern.test(content)) {
                content = content.replace(footerPattern, navigationHTML);
            }
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filename}`);
    } else {
        console.log(`File not found: ${filename}`);
    }
});

console.log('Blog navigation update complete!');
