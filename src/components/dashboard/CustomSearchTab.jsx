import React, { useState, useEffect } from 'react';
import { generateSearchQueries, scrapeTikTokVideos } from '../../services/workflowService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const CustomSearchTab = () => {
  const { user, userProfile } = useAuth();
  
  const [searchParams, setSearchParams] = useState({
    sorting: 'rise',
    days: 7,
    videosLocation: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [lastSearchTime, setLastSearchTime] = useState(() => {
    // Get last search time from localStorage
    const saved = localStorage.getItem(`lastCustomSearch_${user?.id}`);
    return saved ? parseInt(saved) : 0;
  });
  const [timeUntilNextSearch, setTimeUntilNextSearch] = useState(0);

  // Country options with full names
  const countries = [
    { code: '', name: 'Worldwide (No Filter)' },
    { code: 'AD', name: 'AD - Andorra' },
    { code: 'AE', name: 'AE - United Arab Emirates' },
    { code: 'AF', name: 'AF - Afghanistan' },
    { code: 'AG', name: 'AG - Antigua and Barbuda' },
    { code: 'AI', name: 'AI - Anguilla' },
    { code: 'AL', name: 'AL - Albania' },
    { code: 'AM', name: 'AM - Armenia' },
    { code: 'AO', name: 'AO - Angola' },
    { code: 'AQ', name: 'AQ - Antarctica' },
    { code: 'AR', name: 'AR - Argentina' },
    { code: 'AS', name: 'AS - American Samoa' },
    { code: 'AT', name: 'AT - Austria' },
    { code: 'AU', name: 'AU - Australia' },
    { code: 'AW', name: 'AW - Aruba' },
    { code: 'AX', name: 'AX - Åland Islands' },
    { code: 'AZ', name: 'AZ - Azerbaijan' },
    { code: 'BA', name: 'BA - Bosnia and Herzegovina' },
    { code: 'BB', name: 'BB - Barbados' },
    { code: 'BD', name: 'BD - Bangladesh' },
    { code: 'BE', name: 'BE - Belgium' },
    { code: 'BF', name: 'BF - Burkina Faso' },
    { code: 'BG', name: 'BG - Bulgaria' },
    { code: 'BH', name: 'BH - Bahrain' },
    { code: 'BI', name: 'BI - Burundi' },
    { code: 'BJ', name: 'BJ - Benin' },
    { code: 'BL', name: 'BL - Saint Barthélemy' },
    { code: 'BM', name: 'BM - Bermuda' },
    { code: 'BN', name: 'BN - Brunei' },
    { code: 'BO', name: 'BO - Bolivia' },
    { code: 'BQ', name: 'BQ - Caribbean Netherlands' },
    { code: 'BR', name: 'BR - Brazil' },
    { code: 'BS', name: 'BS - Bahamas' },
    { code: 'BT', name: 'BT - Bhutan' },
    { code: 'BV', name: 'BV - Bouvet Island' },
    { code: 'BW', name: 'BW - Botswana' },
    { code: 'BY', name: 'BY - Belarus' },
    { code: 'BZ', name: 'BZ - Belize' },
    { code: 'CA', name: 'CA - Canada' },
    { code: 'CC', name: 'CC - Cocos Islands' },
    { code: 'CD', name: 'CD - Democratic Republic of the Congo' },
    { code: 'CF', name: 'CF - Central African Republic' },
    { code: 'CG', name: 'CG - Republic of the Congo' },
    { code: 'CH', name: 'CH - Switzerland' },
    { code: 'CI', name: 'CI - Côte d\'Ivoire' },
    { code: 'CK', name: 'CK - Cook Islands' },
    { code: 'CL', name: 'CL - Chile' },
    { code: 'CM', name: 'CM - Cameroon' },
    { code: 'CN', name: 'CN - China' },
    { code: 'CO', name: 'CO - Colombia' },
    { code: 'CR', name: 'CR - Costa Rica' },
    { code: 'CU', name: 'CU - Cuba' },
    { code: 'CV', name: 'CV - Cape Verde' },
    { code: 'CW', name: 'CW - Curaçao' },
    { code: 'CX', name: 'CX - Christmas Island' },
    { code: 'CY', name: 'CY - Cyprus' },
    { code: 'CZ', name: 'CZ - Czech Republic' },
    { code: 'DE', name: 'DE - Germany' },
    { code: 'DJ', name: 'DJ - Djibouti' },
    { code: 'DK', name: 'DK - Denmark' },
    { code: 'DM', name: 'DM - Dominica' },
    { code: 'DO', name: 'DO - Dominican Republic' },
    { code: 'DZ', name: 'DZ - Algeria' },
    { code: 'EC', name: 'EC - Ecuador' },
    { code: 'EE', name: 'EE - Estonia' },
    { code: 'EG', name: 'EG - Egypt' },
    { code: 'EH', name: 'EH - Western Sahara' },
    { code: 'ER', name: 'ER - Eritrea' },
    { code: 'ES', name: 'ES - Spain' },
    { code: 'ET', name: 'ET - Ethiopia' },
    { code: 'FI', name: 'FI - Finland' },
    { code: 'FJ', name: 'FJ - Fiji' },
    { code: 'FK', name: 'FK - Falkland Islands' },
    { code: 'FM', name: 'FM - Micronesia' },
    { code: 'FO', name: 'FO - Faroe Islands' },
    { code: 'FR', name: 'FR - France' },
    { code: 'GA', name: 'GA - Gabon' },
    { code: 'GB', name: 'GB - United Kingdom' },
    { code: 'GD', name: 'GD - Grenada' },
    { code: 'GE', name: 'GE - Georgia' },
    { code: 'GF', name: 'GF - French Guiana' },
    { code: 'GG', name: 'GG - Guernsey' },
    { code: 'GH', name: 'GH - Ghana' },
    { code: 'GI', name: 'GI - Gibraltar' },
    { code: 'GL', name: 'GL - Greenland' },
    { code: 'GM', name: 'GM - Gambia' },
    { code: 'GN', name: 'GN - Guinea' },
    { code: 'GP', name: 'GP - Guadeloupe' },
    { code: 'GQ', name: 'GQ - Equatorial Guinea' },
    { code: 'GR', name: 'GR - Greece' },
    { code: 'GS', name: 'GS - South Georgia and the South Sandwich Islands' },
    { code: 'GT', name: 'GT - Guatemala' },
    { code: 'GU', name: 'GU - Guam' },
    { code: 'GW', name: 'GW - Guinea-Bissau' },
    { code: 'GY', name: 'GY - Guyana' },
    { code: 'HK', name: 'HK - Hong Kong' },
    { code: 'HM', name: 'HM - Heard Island and McDonald Islands' },
    { code: 'HN', name: 'HN - Honduras' },
    { code: 'HR', name: 'HR - Croatia' },
    { code: 'HT', name: 'HT - Haiti' },
    { code: 'HU', name: 'HU - Hungary' },
    { code: 'ID', name: 'ID - Indonesia' },
    { code: 'IE', name: 'IE - Ireland' },
    { code: 'IL', name: 'IL - Israel' },
    { code: 'IM', name: 'IM - Isle of Man' },
    { code: 'IN', name: 'IN - India' },
    { code: 'IO', name: 'IO - British Indian Ocean Territory' },
    { code: 'IQ', name: 'IQ - Iraq' },
    { code: 'IR', name: 'IR - Iran' },
    { code: 'IS', name: 'IS - Iceland' },
    { code: 'IT', name: 'IT - Italy' },
    { code: 'JE', name: 'JE - Jersey' },
    { code: 'JM', name: 'JM - Jamaica' },
    { code: 'JO', name: 'JO - Jordan' },
    { code: 'JP', name: 'JP - Japan' },
    { code: 'KE', name: 'KE - Kenya' },
    { code: 'KG', name: 'KG - Kyrgyzstan' },
    { code: 'KH', name: 'KH - Cambodia' },
    { code: 'KI', name: 'KI - Kiribati' },
    { code: 'KM', name: 'KM - Comoros' },
    { code: 'KN', name: 'KN - Saint Kitts and Nevis' },
    { code: 'KP', name: 'KP - North Korea' },
    { code: 'KR', name: 'KR - South Korea' },
    { code: 'KW', name: 'KW - Kuwait' },
    { code: 'KY', name: 'KY - Cayman Islands' },
    { code: 'KZ', name: 'KZ - Kazakhstan' },
    { code: 'LA', name: 'LA - Laos' },
    { code: 'LB', name: 'LB - Lebanon' },
    { code: 'LC', name: 'LC - Saint Lucia' },
    { code: 'LI', name: 'LI - Liechtenstein' },
    { code: 'LK', name: 'LK - Sri Lanka' },
    { code: 'LR', name: 'LR - Liberia' },
    { code: 'LS', name: 'LS - Lesotho' },
    { code: 'LT', name: 'LT - Lithuania' },
    { code: 'LU', name: 'LU - Luxembourg' },
    { code: 'LV', name: 'LV - Latvia' },
    { code: 'LY', name: 'LY - Libya' },
    { code: 'MA', name: 'MA - Morocco' },
    { code: 'MC', name: 'MC - Monaco' },
    { code: 'MD', name: 'MD - Moldova' },
    { code: 'ME', name: 'ME - Montenegro' },
    { code: 'MF', name: 'MF - Saint Martin' },
    { code: 'MG', name: 'MG - Madagascar' },
    { code: 'MH', name: 'MH - Marshall Islands' },
    { code: 'MK', name: 'MK - North Macedonia' },
    { code: 'ML', name: 'ML - Mali' },
    { code: 'MM', name: 'MM - Myanmar' },
    { code: 'MN', name: 'MN - Mongolia' },
    { code: 'MO', name: 'MO - Macao' },
    { code: 'MP', name: 'MP - Northern Mariana Islands' },
    { code: 'MQ', name: 'MQ - Martinique' },
    { code: 'MR', name: 'MR - Mauritania' },
    { code: 'MS', name: 'MS - Montserrat' },
    { code: 'MT', name: 'MT - Malta' },
    { code: 'MU', name: 'MU - Mauritius' },
    { code: 'MV', name: 'MV - Maldives' },
    { code: 'MW', name: 'MW - Malawi' },
    { code: 'MX', name: 'MX - Mexico' },
    { code: 'MY', name: 'MY - Malaysia' },
    { code: 'MZ', name: 'MZ - Mozambique' },
    { code: 'NA', name: 'NA - Namibia' },
    { code: 'NC', name: 'NC - New Caledonia' },
    { code: 'NE', name: 'NE - Niger' },
    { code: 'NF', name: 'NF - Norfolk Island' },
    { code: 'NG', name: 'NG - Nigeria' },
    { code: 'NI', name: 'NI - Nicaragua' },
    { code: 'NL', name: 'NL - Netherlands' },
    { code: 'NO', name: 'NO - Norway' },
    { code: 'NP', name: 'NP - Nepal' },
    { code: 'NR', name: 'NR - Nauru' },
    { code: 'NU', name: 'NU - Niue' },
    { code: 'NZ', name: 'NZ - New Zealand' },
    { code: 'OM', name: 'OM - Oman' },
    { code: 'PA', name: 'PA - Panama' },
    { code: 'PE', name: 'PE - Peru' },
    { code: 'PF', name: 'PF - French Polynesia' },
    { code: 'PG', name: 'PG - Papua New Guinea' },
    { code: 'PH', name: 'PH - Philippines' },
    { code: 'PK', name: 'PK - Pakistan' },
    { code: 'PL', name: 'PL - Poland' },
    { code: 'PM', name: 'PM - Saint Pierre and Miquelon' },
    { code: 'PN', name: 'PN - Pitcairn' },
    { code: 'PR', name: 'PR - Puerto Rico' },
    { code: 'PS', name: 'PS - Palestine' },
    { code: 'PT', name: 'PT - Portugal' },
    { code: 'PW', name: 'PW - Palau' },
    { code: 'PY', name: 'PY - Paraguay' },
    { code: 'QA', name: 'QA - Qatar' },
    { code: 'RE', name: 'RE - Réunion' },
    { code: 'RO', name: 'RO - Romania' },
    { code: 'RS', name: 'RS - Serbia' },
    { code: 'RU', name: 'RU - Russia' },
    { code: 'RW', name: 'RW - Rwanda' },
    { code: 'SA', name: 'SA - Saudi Arabia' },
    { code: 'SB', name: 'SB - Solomon Islands' },
    { code: 'SC', name: 'SC - Seychelles' },
    { code: 'SD', name: 'SD - Sudan' },
    { code: 'SE', name: 'SE - Sweden' },
    { code: 'SG', name: 'SG - Singapore' },
    { code: 'SH', name: 'SH - Saint Helena' },
    { code: 'SI', name: 'SI - Slovenia' },
    { code: 'SJ', name: 'SJ - Svalbard and Jan Mayen' },
    { code: 'SK', name: 'SK - Slovakia' },
    { code: 'SL', name: 'SL - Sierra Leone' },
    { code: 'SM', name: 'SM - San Marino' },
    { code: 'SN', name: 'SN - Senegal' },
    { code: 'SO', name: 'SO - Somalia' },
    { code: 'SR', name: 'SR - Suriname' },
    { code: 'SS', name: 'SS - South Sudan' },
    { code: 'ST', name: 'ST - São Tomé and Príncipe' },
    { code: 'SV', name: 'SV - El Salvador' },
    { code: 'SX', name: 'SX - Sint Maarten' },
    { code: 'SY', name: 'SY - Syria' },
    { code: 'SZ', name: 'SZ - Eswatini' },
    { code: 'TC', name: 'TC - Turks and Caicos Islands' },
    { code: 'TD', name: 'TD - Chad' },
    { code: 'TF', name: 'TF - French Southern Territories' },
    { code: 'TG', name: 'TG - Togo' },
    { code: 'TH', name: 'TH - Thailand' },
    { code: 'TJ', name: 'TJ - Tajikistan' },
    { code: 'TK', name: 'TK - Tokelau' },
    { code: 'TL', name: 'TL - East Timor' },
    { code: 'TM', name: 'TM - Turkmenistan' },
    { code: 'TN', name: 'TN - Tunisia' },
    { code: 'TO', name: 'TO - Tonga' },
    { code: 'TR', name: 'TR - Turkey' },
    { code: 'TT', name: 'TT - Trinidad and Tobago' },
    { code: 'TV', name: 'TV - Tuvalu' },
    { code: 'TW', name: 'TW - Taiwan' },
    { code: 'TZ', name: 'TZ - Tanzania' },
    { code: 'UA', name: 'UA - Ukraine' },
    { code: 'UG', name: 'UG - Uganda' },
    { code: 'UM', name: 'UM - United States Minor Outlying Islands' },
    { code: 'US', name: 'US - United States' },
    { code: 'UY', name: 'UY - Uruguay' },
    { code: 'UZ', name: 'UZ - Uzbekistan' },
    { code: 'VA', name: 'VA - Vatican City' },
    { code: 'VC', name: 'VC - Saint Vincent and the Grenadines' },
    { code: 'VE', name: 'VE - Venezuela' },
    { code: 'VG', name: 'VG - British Virgin Islands' },
    { code: 'VI', name: 'VI - U.S. Virgin Islands' },
    { code: 'VN', name: 'VN - Vietnam' },
    { code: 'VU', name: 'VU - Vanuatu' },
    { code: 'WF', name: 'WF - Wallis and Futuna' },
    { code: 'WS', name: 'WS - Samoa' },
    { code: 'YE', name: 'YE - Yemen' },
    { code: 'YT', name: 'YT - Mayotte' },
    { code: 'ZA', name: 'ZA - South Africa' },
    { code: 'ZM', name: 'ZM - Zambia' },
    { code: 'ZW', name: 'ZW - Zimbabwe' }
  ];

  // Check if 24 hours have passed since last search
  const canSearch = () => {
    const now = Date.now();
    const timeDiff = now - lastSearchTime;
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    return timeDiff >= twentyFourHours;
  };

  // Update countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (!canSearch()) {
        const now = Date.now();
        const timeDiff = lastSearchTime + (24 * 60 * 60 * 1000) - now;
        setTimeUntilNextSearch(Math.max(0, timeDiff));
      } else {
        setTimeUntilNextSearch(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastSearchTime]);

  // Format time remaining
  const formatTimeRemaining = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCustomSearch = async () => {
    if (!canSearch()) {
      const timeRemaining = formatTimeRemaining(timeUntilNextSearch);
      setError(`You can only perform a custom search once every 24 hours. Please wait ${timeRemaining} before searching again.`);
      return;
    }

    if (!userProfile?.business_description || userProfile.business_description.length < 150) {
      console.log('Business description validation failed:', {
        hasDescription: !!userProfile?.business_description,
        length: userProfile?.business_description?.length || 0,
        description: userProfile?.business_description
      });
      setError('Please complete your business description in Settings (minimum 150 characters) before using custom search.');
      return;
    }

    console.log('Starting custom search with business description:', userProfile.business_description);

    try {
      setLoading(true);
      setError(null);
      setResults(null);

      // Step 1: Generate search queries based on business description
      console.log('Generating search queries...');
      const queriesResponse = await generateSearchQueries(userProfile.business_description);
      console.log('Queries response:', queriesResponse);
      
      // Extract queries from the nested response structure
      const searchQueries = queriesResponse.data?.searchQueries || queriesResponse.searchQueries || [];
      console.log('Extracted search queries:', searchQueries);

      if (searchQueries.length === 0) {
        throw new Error('No search queries generated');
      }

      // Step 2: Scrape TikTok videos with custom parameters
      console.log('Scraping TikTok videos with custom parameters...');
      const customParams = {
        sorting: searchParams.sorting,
        days: parseInt(searchParams.days),
        videosLocation: searchParams.videosLocation || null
      };

      const scrapingResponse = await scrapeTikTokVideos(searchQueries, user?.id, 5, customParams);
      console.log('Scraping response:', scrapingResponse);
      
      // Extract videos from the nested response structure
      const videos = scrapingResponse.data?.videos || scrapingResponse.videos || [];
      console.log('Extracted videos:', videos);

      // Update last search time
      const now = Date.now();
      setLastSearchTime(now);
      localStorage.setItem(`lastCustomSearch_${user?.id}`, now.toString());

      setResults({
        searchQueries,
        videos: videos,
        parameters: customParams
      });

      toast.success(`Successfully found ${videos?.length || 0} trending videos!`);

    } catch (err) {
      console.error('Error in custom search:', err);
      setError(err.message || 'Failed to perform custom search');
      toast.error('Failed to perform custom search');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-8">
        <svg className="h-8 w-8 text-accent-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h2 className="text-3xl font-bold gradient-text">Custom Search</h2>
      </div>

      <div className="dashboard-card mb-8">
        <h3 className="text-xl font-semibold mb-6 text-primary-800 dark:text-primary-100">
          Customize Your TikTok Trend Search
        </h3>

        {/* Business Description Display */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            Current Business Profile
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {userProfile?.business_description ? 
              `${userProfile.business_description.substring(0, 200)}${userProfile.business_description.length > 200 ? '...' : ''}` :
              'No business description set. Please complete your profile in Settings.'
            }
          </p>
          {userProfile?.business_description && userProfile.business_description.length < 150 && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
              ⚠️ Business description is too short. Please add more details in Settings (minimum 150 characters).
            </p>
          )}
        </div>

        {/* Rate Limit Notice */}
        {!canSearch() && (
          <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  Search Cooldown Active
                </h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Next search available in: <span className="font-mono font-bold">{formatTimeRemaining(timeUntilNextSearch)}</span>
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  Custom searches are limited to once every 24 hours to prevent API overusage.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Search Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sorting */}
            <div>
              <label htmlFor="sorting" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                Sorting Method
              </label>
              <select
                id="sorting"
                name="sorting"
                value={searchParams.sorting}
                onChange={handleInputChange}
                className="input w-full"
                disabled={loading || !canSearch()}
              >
                <option value="rise">Rise - By Views Daily Rise</option>
                <option value="rate">Rate - By Views Daily Growth %</option>
              </select>
              <div className="text-xs text-primary-600 dark:text-primary-400 mt-2 space-y-1">
                <p className="font-medium">How videos are ranked:</p>
                <p><strong>Rise:</strong> Videos with highest absolute increase in daily views (good for finding viral content)</p>
                <p><strong>Rate:</strong> Videos with highest percentage growth in daily views (good for finding emerging trends)</p>
              </div>
            </div>

            {/* Time Period */}
            <div>
              <label htmlFor="days" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                Time Period
              </label>
              <select
                id="days"
                name="days"
                value={searchParams.days}
                onChange={handleInputChange}
                className="input w-full"
                disabled={loading || !canSearch()}
              >
                <option value={1}>Last Day</option>
                <option value={7}>Last Week</option>
                <option value={30}>Last Month</option>
              </select>
              <div className="text-xs text-primary-600 dark:text-primary-400 mt-2 space-y-1">
                <p className="font-medium">Time range for trend analysis:</p>
                <p><strong>Last Day:</strong> Most recent viral content (24 hours)</p>
                <p><strong>Last Week:</strong> Current trending topics (7 days) - Recommended</p>
                <p><strong>Last Month:</strong> Broader trend patterns (30 days)</p>
              </div>
            </div>

            {/* Country Filter */}
            <div>
              <label htmlFor="videosLocation" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                Country Filter
              </label>
              <select
                id="videosLocation"
                name="videosLocation"
                value={searchParams.videosLocation}
                onChange={handleInputChange}
                className="input w-full"
                disabled={loading || !canSearch()}
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
              <div className="text-xs text-primary-600 dark:text-primary-400 mt-2 space-y-1">
                <p className="font-medium">Geographic targeting:</p>
                <p><strong>Worldwide:</strong> Global trending content from all countries</p>
                <p><strong>Specific Country:</strong> Content trending specifically in that market</p>
                <p>Useful for localized marketing or understanding regional preferences</p>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleCustomSearch}
              disabled={loading || !canSearch() || !userProfile?.business_description || userProfile.business_description.length < 150}
              className="btn btn-primary px-8 py-3 text-lg relative"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching Trends...
                </>
              ) : !canSearch() ? (
                <>
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Search on Cooldown
                </>
              ) : (
                <>
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search Custom Trends
                </>
              )}
            </button>
          </div>

          {/* Helper Text */}
          <div className="text-center text-sm text-primary-600 dark:text-primary-400">
            <p>Custom searches use your business profile to find relevant trending content.</p>
            <p className="text-xs mt-1">Limited to one search per 24 hours to prevent API overusage.</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="dashboard-card mb-8">
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="dashboard-card">
          <h3 className="text-xl font-semibold mb-4 text-primary-800 dark:text-primary-100">
            Search Results
          </h3>
          
          <div className="mb-4 p-4 bg-accent-50 dark:bg-accent-900/20 rounded-lg">
            <p className="text-sm text-accent-700 dark:text-accent-300">
              <strong>Parameters:</strong> {results.parameters.sorting} sorting, 
              last {results.parameters.days} day{results.parameters.days > 1 ? 's' : ''}, 
              {results.parameters.videosLocation ? `filtered for ${results.parameters.videosLocation}` : 'worldwide'}
            </p>
            <p className="text-sm text-accent-700 dark:text-accent-300">
              <strong>Search Queries:</strong> {results.searchQueries.join(', ')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.videos.map((video, index) => (
              <div key={index} className="bg-white dark:bg-primary-800 rounded-lg border border-primary-100 dark:border-primary-700 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Thumbnail */}
                {video.coverUrl && (
                  <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
                    <img
                      src={video.coverUrl}
                      alt={video.title || 'TikTok video thumbnail'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to TikTok placeholder if image fails to load
                        e.target.src = 'https://lf16-tiktok-web.ttwstatic.com/obj/tiktok-web/tiktok/webapp/main/webapp-mobile/8152caf0c8e8bc67ae23.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="p-4">
                  <h4 className="font-semibold text-primary-800 dark:text-primary-100 mb-2 line-clamp-2">
                    {video.title || video.searchQuery}
                  </h4>
                  <p className="text-sm text-primary-600 dark:text-primary-400 mb-3">
                    By: {video.author}
                  </p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-xs text-primary-500 dark:text-primary-500 mb-3">
                    <div className="text-center">
                      <div className="font-semibold">👀</div>
                      <div>{video.views?.toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">❤️</div>
                      <div>{video.likes?.toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">🔄</div>
                      <div>{video.shares?.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <a
                    href={video.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-accent-500 hover:text-accent-600 text-sm font-medium transition-colors"
                  >
                    View on TikTok 
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {results.videos.length === 0 && (
            <p className="text-center text-primary-600 dark:text-primary-400 py-8">
              No videos found with the current search parameters. Try adjusting your filters.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomSearchTab;
