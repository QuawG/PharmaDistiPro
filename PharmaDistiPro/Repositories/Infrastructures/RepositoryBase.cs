//using MailKit.Search;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.EntityFrameworkCore.Internal;
//using Microsoft.EntityFrameworkCore.Storage;
//using Seedup.Common.Data;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Linq.Expressions;
//using System.Text;
//using System.Threading.Tasks;

//namespace SeedUp.Data.Infrastructure
//{
//    public abstract class RepositoryBase<T> : IRepository<T> where T : class
//    {
//        //protected SeedupContext _context;
//        //private readonly DbSet<T> _dbSet;
//        //protected RepositoryBase(SeedupContext context)
//        //{
//        //    _context = context;
//        //    _dbSet = _context.Set<T>();
//        //}


//        #region implimentation

//        public async Task<IEnumerable<T>> GetAllAsync()
//        {
//            return await _dbSet.ToListAsync();
//        }

//        public T GetById(object id)
//        {
//            return _dbSet.Find(id);
//        }

//        public async Task<T> GetByIdAsync(object id)
//        {
//            return await _dbSet.FindAsync(id);
//        }


//        public async Task<IEnumerable<T>> GetByConditionAsync(Expression<Func<T, bool>> expression, 
//            string[]? includes = null, Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null)
//        {
//			IQueryable<T> query = _dbSet;

//			if (includes != null)
//			{
//				foreach (var include in includes)
//				{
//					query = query.Include(include);
//				}
//			}

//			query = query.Where(expression);

//			if (orderBy != null)
//			{
//				query = orderBy(query);
//			}

//            return await query.ToListAsync();

//		}

//        public async Task<T> GetSingleByConditionAsync(Expression<Func<T, bool>> expression, string[]? includes = null)
//        {
//            IQueryable<T> query = _dbSet;

//            if (includes != null)
//            {
//                foreach (var include in includes)
//                {
//                    query = query.Include(include);
//                }
//            }

//            return await query.FirstOrDefaultAsync(expression);
//        }

//        public async Task<T> InsertAsync(T entity)
//        {
//            await _dbSet.AddAsync(entity);
//        //    await SaveAsync();
//            return entity;
//        }


//        public async Task<T> UpdateAsync(T entity)
//        {
//            _dbSet.Attach(entity);
//            _context.Entry(entity).State = EntityState.Modified;
//            return entity;
//        }


//        public async Task<T> DeleteAsync(T entity)
//        {
//            if (entity != null)
//            {
//                _dbSet.Remove(entity);
//            }
//            return entity;
//        }


//        public async Task<IEnumerable<T>> GetPagedAsync(Expression<Func<T, bool>> filter, 
//            int pageNumber, int pageSize, string[]? includes = null,
//			Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null)
//        {
//			IQueryable<T> query = _dbSet;

//			if (includes != null)
//			{
//				foreach (var include in includes)
//				{
//					query = query.Include(include);
//				}
//			}

//			query = query.Where(filter);

//			if (orderBy != null)
//			{
//				query = orderBy(query);
//			}

//			return await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync(); ;
//        }
//        public async Task<int> CountAsync(Expression<Func<T, bool>> expression)
//        {
//            IQueryable<T> query = _dbSet;
//            return await query.CountAsync(expression);
//        }

//        public async Task<int> SaveAsync()
//        {
//            return await _context.SaveChangesAsync();
//        }

//		public async Task<IDbContextTransaction> BeginTransactionAsync()
//		{
//			return await _context.Database.BeginTransactionAsync();
//		}


//		#endregion
//	}
//}
