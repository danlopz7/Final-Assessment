using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs.input;
using backend.DTOs.output;
using backend.Models.Entities;
using backend.Repositories.Interfaces;
using backend.Services.Interfaces;

namespace backend.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly ICustomerRepository _customerRepository;
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IProductRepository _productRepository;

        public OrderService(
            IOrderRepository orderRepository,
            ICustomerRepository customerRepository,
            IEmployeeRepository employeeRepository,
            IProductRepository productRepository
        )
        {
            _orderRepository = orderRepository;
            _orderRepository = orderRepository;
            _customerRepository = customerRepository;
            _employeeRepository = employeeRepository;
            _productRepository = productRepository;
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

        public async Task<OrderDto> CreateOrUpdateOrderAsync(OrderInputDto dto)
        {
            if (dto.OrderId == null)
            {
                return await CreateOrderAsync(dto);
            }
            else
            {
                return await UpdateOrderAsync(dto);
            }
        }

        // endpoint to save data from the UI
        public async Task<OrderDto> CreateOrderAsync(OrderInputDto dto)
        {
            // Valido existencia de Customer y Employee
            var customer = await _customerRepository.FindByIdAsync(dto.Customer.Id);
            if (customer == null)
                throw new Exception($"Customer with ID {dto.Customer.Id} not found.");

            var employee = await _employeeRepository.FindByIdAsync(dto.Employee.Id);
            if (employee == null)
                throw new Exception($"Employee with ID {dto.Employee.Id} not found.");

            // Creo entidad Order
            var order = new Order
            {
                OrderDate = dto.OrderDate ?? DateTime.UtcNow,
                CustomerId = dto.Customer.Id,
                EmployeeId = dto.Employee.Id,
                ShipAddress = dto.ShippingAddress.ShipAddress,
                ShipCity = dto.ShippingAddress.ShipCity,
                ShipRegion = dto.ShippingAddress.ShipRegion,
                ShipPostalCode = dto.ShippingAddress.ShipPostalCode,
                ShipCountry = dto.ShippingAddress.ShipCountry,
                OrderDetails = new List<OrderDetail>(),
            };

            // Construir OrderDetails
            foreach (var detailDto in dto.OrderDetails)
            {
                var product = await _productRepository.FindByIdAsync(detailDto.Product.Id);
                if (product == null)
                    throw new Exception($"Product with ID {detailDto.Product.Id} not found.");

                order.OrderDetails.Add(
                    new OrderDetail
                    {
                        ProductId = product.ProductId,
                        Quantity = detailDto.Quantity,
                        UnitPrice = product.UnitPrice ?? 0, // default if null
                    }
                );
            }

            // Guardar en la base
            await _orderRepository.AddOrderAsync(order);

            // Recargar orden completa desde DB (con relaciones)
            var saved = await _orderRepository.GetOrderByIdWithDetailsAsync(order.OrderId);

            // Retornar como OrderDto usando método de mapeo
            return MapOrderToDto(order);
        }

        private async Task<OrderDto> UpdateOrderAsync(OrderInputDto dto)
        {
            var order = await _orderRepository.GetOrderByIdWithDetailsAsync(dto.OrderId.Value);
            if (order == null)
                throw new Exception($"Order with ID {dto.OrderId.Value} not found.");

            // Actualizar propiedades
            order.OrderDate = dto.OrderDate ?? order.OrderDate;
            order.CustomerId = dto.Customer.Id;
            order.EmployeeId = dto.Employee.Id;
            order.ShipAddress = dto.ShippingAddress.ShipAddress;
            order.ShipCity = dto.ShippingAddress.ShipCity;
            order.ShipRegion = dto.ShippingAddress.ShipRegion;
            order.ShipPostalCode = dto.ShippingAddress.ShipPostalCode;
            order.ShipCountry = dto.ShippingAddress.ShipCountry;

            // Limpiar y reemplazar los detalles
            order.OrderDetails.Clear();

            foreach (var detailDto in dto.OrderDetails)
            {
                var product = await _productRepository.FindByIdAsync(detailDto.Product.Id);
                if (product == null)
                    throw new Exception($"Product with ID {detailDto.Product.Id} not found.");

                order.OrderDetails.Add(
                    new OrderDetail
                    {
                        ProductId = product.ProductId,
                        Quantity = detailDto.Quantity,
                        UnitPrice = product.UnitPrice ?? 0,
                    }
                );
            }

            await _orderRepository.UpdateOrderAsync(order);

            return MapOrderToDto(order);
        }

        public async Task<bool> DeleteOrderAsync(int id)
        {
            var order = await _orderRepository.GetOrderByIdAsync(id);
            if (order == null)
                return false;

            await _orderRepository.DeleteOrderAsync(id);
            return true;
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
                    ContactName = order.Customer?.ContactName,
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


