using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs;
using backend.Models.Entities;
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

        public async Task<OrderDto> GetFirstOrderAsync()
        {
            var order = await _orderRepository.GetFirstOrderAsync();
            return order == null ? null : MapOrderToDto(order);
        }

        public async Task<OrderDto> GetOrderByIdAsync(int id)
        {
            var order = await _orderRepository.GetOrderByIdAsync(id);
            return order == null ? null : MapOrderToDto(order);
        }

        // endpoint to save data from the UI
        public async Task<OrderDto> CreateOrderAsync(OrderDto orderDto)
        {
            // convert OrderDto back to Order entity
            // Then call the repository to save it.
            return null;
        }

        public async Task<OrderDto> GetNextOrderAsync(int id)
        {
            var next = await _orderRepository.GetNextOrderAsync(id);
            return next == null ? null : MapOrderToDto(next);
        }

        public async Task<OrderDto> GetPreviousOrderAsync(int id)
        {
            var previous = await _orderRepository.GetPreviousOrderAsync(id);
            return previous == null ? null : MapOrderToDto(previous);
        }

        public Task<bool> ExistsOrderAfterAsync(int currentId)
        {
            return _orderRepository.ExistsOrderAfter(currentId);
        }

        public Task<bool> ExistsOrderBeforeAsync(int currentId)
        {
            return _orderRepository.ExistsOrderBefore(currentId);
        }

        // Reutilizable logica de mapeo manual
        private OrderDto MapOrderToDto(Order order)
        {
            return new OrderDto
            {
                OrderId = order.OrderId,
                OrderDate = order.OrderDate,
                Customer = new CustomerSimpleDto 
                { 
                    Id = order.Customer?.CustomerId,
                    ContactName = order.Customer?.ContactName 
                },
                Employee = new EmployeeSimpleDto
                {
                    Id = order.Employee?.EmployeeId,
                    FullName = $"{order.Employee.FirstName} {order.Employee.LastName}",
                    //FirstName = order.Employee?.FirstName,
                    //LastName = order.Employee?.LastName,
                },
                ShippingAddress = new ShippingAddressDto
                {
                    ShipAddress = order.ShipAddress,
                    ShipCity = order.ShipCity,
                    ShipRegion = order.ShipRegion,
                    ShipPostalCode = order.ShipPostalCode,
                    ShipCountry = order.ShipCountry,
                },
                OrderDetails = order
                    .OrderDetails?.Select(od => new OrderDetailDto
                    {
                        Product = new ProductSimpleDto
                        {
                            Id = od.Product?.ProductId,
                            ProductName = od.Product?.ProductName,
                            UnitPrice = od.Product?.UnitPrice,
                        },
                        Quantity = od.Quantity,
                    })
                    .ToList(),
            };
        }

    }
}



/* public async Task<OrderDto> GetOrderByIdAsync(int id)
        {
            var order = await _orderRepository.GetOrderByIdAsync(id);

            if (order == null)
                return null;

            return new OrderDto
            {
                OrderId = order.OrderId,
                OrderDate = order.OrderDate,
                Customer = new CustomerSimpleDto { ContactName = order.Customer?.ContactName },
                ShippingAddress = new ShippingAddressDto
                {
                    ShipAddress = order.ShipAddress,
                    ShipCity = order.ShipCity,
                    ShipRegion = order.ShipRegion,
                    ShipPostalCode = order.ShipPostalCode,
                    ShipCountry = order.ShipCountry,
                },
                Employee = new EmployeeSimpleDto
                {
                    FirstName = order.Employee?.FirstName,
                    LastName = order.Employee?.LastName,
                },
                OrderDetails = order
                    .OrderDetails?.Select(od => new OrderDetailDto
                    {
                        Product = new ProductSimpleDto
                        {
                            ProductName = od.Product?.ProductName,
                            UnitPrice = od.Product?.UnitPrice,
                        },
                        Quantity = od.Quantity,
                    })
                    .ToList(),
            };
        }
 */
