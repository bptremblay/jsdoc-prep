# This ensures that only the right RPM repositories have been enabled.
class seurat::rpm_manager {
  file { 'Remove existing yum repos':
    ensure  => directory,
    path    => '/etc/yum.repos.d',
    recurse => true,
    purge   => true,
  }

  yumrepo { 'internal':
    descr    => 'internal',
    baseurl  => $::repository,
    enabled  => 1,
    gpgcheck => 0,
    require  => [
      File['Remove existing yum repos'],
    ],
  }
}
