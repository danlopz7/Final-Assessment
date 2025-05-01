using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs
{
    public class NavigationResultDto
    {
        public OrderDto Order { get; set; }
        public bool HasNext { get; set; }
        public bool HasPrevious { get; set; }
    }
}