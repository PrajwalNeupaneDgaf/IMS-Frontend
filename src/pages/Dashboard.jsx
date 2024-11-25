import {
  Box,
  Heading,
  Text,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Tooltip,
  IconButton,
  Spinner,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip } from 'chart.js';
import api from '../utils/axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip);

const Dashboard = () => {
  const [data, setData] = useState({
    totalSales: 0,
    totalUsers: 0,
    inventoryItems: 0,
    salesData: [],
  });
  const [loading, setLoading] = useState(true);

  // Fetch Dashboard Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/dashboard/overview');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sales Chart Data processing
  const chartData = {
    labels: [], // This will store months from 'SoldOn'
    datasets: [], // This will store datasets for each category
  };

  // Process sales data for chart
  const salesByCategory = {};
  data.salesData.forEach(item => {
    const month = new Date(item.soldOn).toLocaleString('default', { month: 'short' }) + ' ' + new Date(item.soldOn).getFullYear();
    const category = item.category;
    const saleAmount = item.price * item.amountSold;  // Correctly calculate sale amount

    if (!salesByCategory[category]) {
      salesByCategory[category] = {};
    }
    
    if (!salesByCategory[category][month]) {
      salesByCategory[category][month] = 0;
    }

    salesByCategory[category][month] += saleAmount;  // Accumulate sales by category and month
  });

  // Prepare chart labels (months) and datasets (categories)
  const categories = Object.keys(salesByCategory);  // Get all categories from sales data
  const months = Array.from(new Set(data.salesData.map(item => new Date(item.soldOn).toLocaleString('default', { month: 'short' }) + ' ' + new Date(item.soldOn).getFullYear())));

  categories.forEach(category => {
    chartData.datasets.push({
      label: category,
      data: months.map(month => salesByCategory[category][month] || 0),  // Assign sales per category per month
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    });
  });

  chartData.labels = months;

  const bg = useColorModeValue('gray.50', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.100');
  const cardBg = useColorModeValue('white', 'gray.700');
  const statBg = useColorModeValue('brand.500', 'brand.900');

  if (loading) {
    return (
      <Box
        bg={bg}
        p={6}
        borderRadius="md"
        boxShadow="xl"
        minH="80vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="xl" color="teal.500" />
        <Text fontSize="xl" mt={4} color={textColor}>
          Loading Dashboard...
        </Text>
      </Box>
    );
  }

  const stats = [
    { label: 'Total Sales', value: `$${data.totalSales}`, tooltip: 'Total sales made in the last 30 days' },
    { label: 'Total Users', value: data.totalUsers, tooltip: 'Total number of users registered on the platform' },
    { label: 'Inventory Items', value: data.inventoryItems, tooltip: 'Total items currently in the inventory' },
  ];

  return (
    <Box bg={bg} p={6} borderRadius="md" boxShadow="xl" minH="80vh" display="flex" flexDirection="column">
      <Heading size="md" mb={6} textAlign="center">
        Dashboard Overview
      </Heading>

      {/* Stats Grid */}
      <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }} gap={6} mb={8}>
        {stats.map((stat, index) => (
          <Box
            key={index}
            bg={cardBg}
            p={6}
            borderRadius="lg"
            boxShadow="lg"
            _hover={{ boxShadow: '2xl', transform: 'scale(1.05)' }}
            transition="all 0.2s ease"
          >
            <Stat>
              <StatLabel fontSize="lg" fontWeight="medium" color={textColor}>
                {stat.label}
              </StatLabel>
              <StatNumber fontSize="3xl" fontWeight="bold" color={statBg}>
                {stat.value}
              </StatNumber>
              <Tooltip label={stat.tooltip}>
                <IconButton
                  aria-label="Info"
                  icon={<InfoIcon />}
                  variant="ghost"
                  size="sm"
                  colorScheme="blue"
                  float="right"
                  mt={-8}
                  mr={-4}
                />
              </Tooltip>
            </Stat>
          </Box>
        ))}
      </Grid>

      {/* Sales Chart */}
      <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="lg" mb={8}>
        <Heading size="sm" mb={4} color={textColor}>
          Sales Overview (Last 6 Months)
        </Heading>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              title: { display: true, text: 'Sales Data by Category', fontSize: 20 },
              tooltip: {
                callbacks: {
                  label: function (tooltipItem) {
                    return `Sales: $${tooltipItem.raw}`;
                  },
                },
              },
            },
          }}
        />
      </Box>

      {/* Additional info */}
      <Text fontSize="lg" mt={8} color={textColor}>
        More detailed statistics and interactive graphs will be shown here.
      </Text>
    </Box>
  );
};

export default Dashboard;
