using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Infrastructures;
using PharmaDistiPro.Repositories.Interface;

namespace PharmaDistiPro.Repositories.Impl
{
    public class OrderRepository : RepositoryBase<Order>, IOrderRepository
    {
        public OrderRepository(SEP490_G74Context context) : base(context)
        {
        }
    }
}
