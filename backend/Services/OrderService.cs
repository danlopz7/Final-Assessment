using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs;
using backend.Repositories.Interfaces;
using backend.Services.Interfaces;

namespace backend.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;

        public OrderService(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<OrderDto> GetOrderByIdAsync(int id)
        {
            var order = await _orderRepository.GetOrderByIdAsync(id);

            if (order == null)
                return null;

            return new OrderDto
            {
                OrderId = order.OrderId,
                OrderDate = order.OrderDate,
                Customer = new CustomerSimpleDto
                {
                    ContactName = order.Customer?.ContactName
                },
                ShippingAddress = new ShippingAddressDto
                {
                    ShipAddress = order.ShipAddress,
                    ShipCity = order.ShipCity,
                    ShipRegion = order.ShipRegion,
                    ShipPostalCode = order.ShipPostalCode,
                    ShipCountry = order.ShipCountry
                },
                Employee = new EmployeeSimpleDto
                {
                    FirstName = order.Employee?.FirstName,
                    LastName = order.Employee?.LastName
                },
                OrderDetails = order.OrderDetails?.Select(od => new OrderDetailDto
                {
                    Product = new ProductSimpleDto
                    {
                        ProductName = od.Product?.ProductName,
                        UnitPrice = od.Product?.UnitPrice
                    },
                    Quantity = od.Quantity
                }).ToList()
            };
        }

        // endpoint to save data from the UI
        public async Task<OrderDto> CreateOrderAsync(OrderDto orderDto)
        {
            // add logic to convert OrderDto back to Order entity
            // Then call the repository to save it.
            return null;
        }
    }
}